/**
 * Infrastructure: ApiProjectRepository
 * Real backend implementation — calls /api/v1/projects REST API.
 * getProjects, getProjectStats, createProject → real API.
 * Other write operations → in-memory fallback until backend endpoints ready.
 */

import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';
import {
  Project,
  ProjectCollection,
  ProjectStats,
  ProjectPagination,
  ProjectStatus,
  ProjectCategory,
  ProjectPriority,
  ProjectBillingType,
  ProjectAdditionalFees,
  ExternalMarketer,
  CreateProjectDTO,
  UpdateProjectDTO,
  PayTerminDTO,
  calcProjectTotal,
  calcGrandTotal,
} from '@/src/domain/entities/Project';
import { getToken, getSession } from '@/src/presentation/hooks/auth/useAuth';
import { PermissionError } from '@/src/infrastructure/api/apiFetch';
import { ProjectRepository } from './ProjectRepository';

// ─── Constants ───────────────────────────────────────────────────────────────

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const BASE    = `${BACKEND}/api/v1/projects`;

// ─── API Response Types ───────────────────────────────────────────────────────

/** Single project shape — list view (minimal fields) */
interface ApiProject {
  id:              string;
  nomorProyek:     string;
  judulProyek:     string;
  kategori:        string;
  deskripsiSingkat?: string;
  namaClient:      string;
  instansi?:       string;
  status:          string;   // 'baru' | 'pending' | 'proses' | 'selesai' | 'dibayar' | 'dibatalkan'
  prioritas:       string;   // 'rendah' | 'sedang' | 'tinggi'
  tipePembayaran:  string;   // 'reguler' | 'sewa' | 'termin'
  deadline:        string;
  deadlineStatus?: string;
  sisaHari?:       number;
  totalNilai:      number;
  createdAt:       string;
}

/** Item shape in the detail/create response */
interface ApiProjectItem {
  namaItem:    string;
  quantity:    number;
  satuan:      string;
  hargaSatuan: number;
  subtotal?:   number;
}

/** biayaLainnya entry from backend */
interface ApiBiayaLainnya {
  tipe:       string;   // 'e_materai' | 'materai' | 'e_sign' | 'biaya_admin' | 'lainnya'
  keterangan: string | null;
  nominal:    number;
}

/** marketingExternal shape from backend */
interface ApiMarketingExternal {
  namaMarketer:  string;
  kontak?:       string | null;
  tipeFee:       string;   // 'persentase' | 'nominal'
  feePersentase: number | null;
  feeNominal:    number | null;
  totalNilai?:   number | null;
  catatan?:      string | null;
}

/**
 * Full project shape — returned from create and detail endpoints.
 * All fields from list plus the expanded ones.
 */
interface ApiProjectDetail extends ApiProject {
  deskripsi?:           string;
  kontak?:              string;
  assignedToUserId?:    string;
  nomorPO?:             string | null;
  catatan?:             string | null;
  ppnPersen?:           number | null;
  ppnNominal?:          number | null;
  pphPersen?:           number | null;
  pphNominal?:          number | null;
  biayaLainnya?:        ApiBiayaLainnya[] | null;
  marketingExternal?:   ApiMarketingExternal | null;
  items?:               ApiProjectItem[];
  updatedAt?:           string;
}

interface ApiProjectSummary {
  total:      number;
  baru:       number;
  proses:     number;
  pending:    number;
  selesai:    number;
  dibayar:    number;
  dibatalkan: number;
}

interface ApiProjectListData {
  data:        ApiProject[];
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
  summary:     ApiProjectSummary;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

/** Map backend status string → local ProjectStatus */
function mapStatus(s: string): ProjectStatus {
  const map: Record<string, ProjectStatus> = {
    baru:        'Baru',
    pending:     'Pending',
    proses:      'Proses',
    selesai:     'Selesai',
    dibayar:     'Dibayar',
    dibatalkan:  'Dibatalkan',
  };
  return map[s.toLowerCase()] ?? 'Baru';
}

/** Map backend priority string → local ProjectPriority */
function mapPriority(s: string): ProjectPriority {
  const map: Record<string, ProjectPriority> = {
    rendah:  'Rendah',
    sedang:  'Sedang',
    tinggi:  'Tinggi',
  };
  return map[s.toLowerCase()] ?? 'Sedang';
}

/** Map backend billing type string → local ProjectBillingType */
function mapBillingType(s: string): ProjectBillingType {
  const map: Record<string, ProjectBillingType> = {
    reguler: 'Reguler',
    sewa:    'Sewa',
    termin:  'Termin',
  };
  return map[s.toLowerCase()] ?? 'Reguler';
}

/** Map backend kategori string → local ProjectCategory */
function mapCategory(s: string): ProjectCategory {
  const map: Record<string, ProjectCategory> = {
    'software development': 'Lainnya',
    'mobile development':   'Lainnya',
    'infrastructure':       'Lainnya',
    'pengadaan barang':     'Pengadaan Barang',
    'pengadaan jasa':       'Pengadaan Jasa',
    'pengadaan atk':        'Pengadaan ATK',
    'pengadaan komputer':   'Pengadaan Komputer',
    'pengadaan furniture':  'Pengadaan Furniture',
    'lainnya':              'Lainnya',
  };
  return map[s.toLowerCase()] ?? 'Lainnya';
}

/** Map biayaLainnya array → ProjectAdditionalFees */
function mapBiaya(
  ppnPersen?: number | null,
  pphPersen?: number | null,
  biaya?: ApiBiayaLainnya[] | null,
): ProjectAdditionalFees | undefined {
  const hasAnything = ppnPersen || pphPersen || (biaya && biaya.length > 0);
  if (!hasAnything) return undefined;

  const fees: ProjectAdditionalFees = {};

  if (ppnPersen) {
    fees.ppnRate = ppnPersen as 11 | 12;
  }
  if (pphPersen) {
    fees.pphEnabled = true;
    fees.pphRate    = pphPersen;
  }

  for (const b of biaya ?? []) {
    switch (b.tipe) {
      case 'e_materai':
        fees.eMateraiEnabled = true;
        fees.eMateraiAmount  = b.nominal;
        break;
      case 'materai':
        fees.materaiEnabled = true;
        fees.materaiAmount  = b.nominal;
        break;
      case 'e_sign':
        fees.eSignEnabled = true;
        fees.eSignAmount  = b.nominal;
        break;
      case 'biaya_admin':
        fees.adminFeeEnabled  = true;
        fees.adminFeeAmount   = b.nominal;
        fees.adminFeePlatform = b.keterangan ?? undefined;
        break;
      // 'lainnya' → no mapped field, skip
    }
  }

  return Object.keys(fees).length > 0 ? fees : undefined;
}

/** Map marketingExternal → ExternalMarketer */
function mapMarketer(m?: ApiMarketingExternal | null): ExternalMarketer | undefined {
  if (!m) return undefined;
  return {
    name:    m.namaMarketer,
    contact: m.kontak ?? undefined,
    feeType: m.tipeFee === 'persentase' ? 'percent' : 'flat',
    ...(m.tipeFee === 'persentase'
      ? { feePercent: m.feePersentase ?? 0 }
      : { feeAmount:  m.feeNominal   ?? 0 }),
    notes: m.catatan ?? undefined,
  };
}

/** Convert list-view ApiProject → local Project entity (minimal fields) */
function mapApiProject(p: ApiProject): Project {
  return {
    id:          p.nomorProyek ?? p.id,
    title:       p.judulProyek,
    description: p.deskripsiSingkat ?? '',
    category:    mapCategory(p.kategori),
    status:      mapStatus(p.status),
    priority:    mapPriority(p.prioritas),
    billingType: mapBillingType(p.tipePembayaran),
    client: {
      name:        p.namaClient,
      contact:     '',
      institution: p.instansi,
    },
    items:       [],
    totalValue:  p.totalNilai,
    grandTotal:  p.totalNilai,
    assignedTo:  '',
    createdAt:   new Date(p.createdAt),
    deadline:    new Date(p.deadline),
    origin:      'direct',
  };
}

/** Convert full detail ApiProjectDetail → local Project entity (all fields) */
function mapApiProjectDetail(p: ApiProjectDetail): Project {
  const items = (p.items ?? []).map(it => ({
    name:      it.namaItem,
    quantity:  it.quantity,
    unit:      it.satuan,
    unitPrice: it.hargaSatuan,
  }));

  const totalValue = p.totalNilai ?? calcProjectTotal(items);
  const fees       = mapBiaya(p.ppnPersen, p.pphPersen, p.biayaLainnya);
  const marketer   = mapMarketer(p.marketingExternal);
  const grandTotal = calcGrandTotal(totalValue, fees);

  return {
    id:           p.nomorProyek ?? p.id,
    title:        p.judulProyek,
    description:  p.deskripsi ?? p.deskripsiSingkat ?? '',
    category:     mapCategory(p.kategori),
    status:       mapStatus(p.status),
    priority:     mapPriority(p.prioritas),
    billingType:  mapBillingType(p.tipePembayaran),
    client: {
      name:        p.namaClient,
      contact:     p.kontak ?? '',
      institution: p.instansi,
    },
    items,
    totalValue,
    grandTotal,
    ...(fees     ? { additionalFees:    fees }     : {}),
    ...(marketer ? { externalMarketer:  marketer } : {}),
    assignedTo:  p.assignedToUserId ?? '',
    createdAt:   new Date(p.createdAt),
    deadline:    new Date(p.deadline),
    ...(p.nomorPO ? { poNumber: p.nomorPO }     : {}),
    ...(p.catatan ? { notes:    p.catatan }     : {}),
    origin:      'direct',
  };
}

/** Map local ProjectPriority → API string */
function mapPriorityToApi(p: ProjectPriority): string {
  return p.toLowerCase(); // 'Rendah' → 'rendah', etc.
}

/** Map local ProjectBillingType → API string */
function mapBillingTypeToApi(b: ProjectBillingType): string {
  return b.toLowerCase(); // 'Reguler' → 'reguler', etc.
}

// ─── Shared auth fetch ────────────────────────────────────────────────────────

async function projectApiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const json = await res.json();

  if (res.status === 403 || json.statusCode === 403) {
    throw new PermissionError(
      Array.isArray(json.message) ? json.message[0] : (json.message ?? 'Akses ditolak'),
    );
  }

  if (!json.success) throw new Error(
    Array.isArray(json.message) ? json.message[0] : (json.message ?? 'API error'),
  );

  // Outer wrapper: { success, data: { success, data: { data: [...], summary, ... } } }
  const outer = json.data;
  if (outer && typeof outer === 'object' && 'success' in outer && 'data' in outer) {
    if (!outer.success) throw new Error(
      Array.isArray(outer.message) ? outer.message[0] : (outer.message ?? 'API error'),
    );
    return outer.data as T;
  }
  return outer as T;
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class ApiProjectRepository implements IProjectRepository {
  /** Fallback: delegate all write operations to in-memory repo */
  private local = new ProjectRepository();

  async getProjects(
    page: number,
    perPage: number,
    statusFilter?: string,
    categoryFilter?: string,
    search?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _billingTypeFilter?: string,
  ): Promise<ProjectCollection> {
    const sp = new URLSearchParams();
    sp.set('page',  String(page));
    sp.set('limit', String(perPage));

    if (statusFilter && statusFilter !== 'Semua') {
      sp.set('status', statusFilter.toLowerCase());
    }
    if (search) {
      sp.set('search', search);
    }

    const result = await projectApiFetch<ApiProjectListData>(`${BASE}?${sp.toString()}`);

    const projects = (result.data ?? []).map(mapApiProject);

    const pagination: ProjectPagination = {
      currentPage:   result.page,
      totalPages:    result.totalPages,
      totalProjects: result.total,
      perPage:       result.limit,
    };

    return new ProjectCollection(projects, pagination);
  }

  async getProjectStats(): Promise<ProjectStats> {
    // Fetch page 1 to extract summary
    const sp = new URLSearchParams({ page: '1', limit: '1' });
    const result = await projectApiFetch<ApiProjectListData>(`${BASE}?${sp.toString()}`);

    const s = result.summary;
    return {
      total:      s.total,
      baru:       s.baru,
      pending:    s.pending,
      proses:     s.proses,
      selesai:    s.selesai,
      dibayar:    s.dibayar,
      dibatalkan: s.dibatalkan,
      totalValue: 0, // backend doesn't return totalValue in summary
    };
  }

  // ── Write operations ────────────────────────────────────────────────────────

  getProjectById(id: string): Promise<Project | null> {
    return this.local.getProjectById(id);
  }

  async createProject(dto: CreateProjectDTO): Promise<Project> {
    const session = getSession();

    // Build biayaLainnya from additionalFees
    const biayaLainnya: { tipe: string; keterangan: string | null; nominal: number }[] = [];
    const fees = dto.additionalFees;
    if (fees?.eMateraiEnabled) {
      biayaLainnya.push({ tipe: 'e_materai', keterangan: null, nominal: fees.eMateraiAmount ?? 10_000 });
    }
    if (fees?.materaiEnabled) {
      biayaLainnya.push({ tipe: 'materai', keterangan: null, nominal: fees.materaiAmount ?? 10_000 });
    }
    if (fees?.eSignEnabled) {
      biayaLainnya.push({ tipe: 'e_sign', keterangan: null, nominal: fees.eSignAmount ?? 0 });
    }
    if (fees?.adminFeeEnabled) {
      biayaLainnya.push({
        tipe:       'biaya_admin',
        keterangan: fees.adminFeePlatform ?? null,
        nominal:    fees.adminFeeAmount ?? 0,
      });
    }

    // Build marketingExternal
    const mkt = dto.externalMarketer;
    const subtotalForMkt = calcProjectTotal(dto.items);
    const mktTotalNilai  = mkt
      ? (mkt.feeType === 'percent'
          ? Math.round((subtotalForMkt * (mkt.feePercent ?? 0)) / 100)
          : (mkt.feeAmount ?? 0))
      : 0;
    const marketingExternal = mkt ? {
      namaMarketer:  mkt.name,
      kontak:        mkt.contact ?? null,
      tipeFee:       mkt.feeType === 'percent' ? 'persentase' : 'nominal',
      feePersentase: mkt.feeType === 'percent' ? (mkt.feePercent ?? null)  : null,
      feeNominal:    mkt.feeType === 'flat'    ? (mkt.feeAmount  ?? null)  : null,
      totalNilai:    mktTotalNilai,
      catatan:       mkt.notes ?? null,
    } : undefined;

    const deadline = new Date(dto.deadline);
    const body: Record<string, unknown> = {
      judulProyek:       dto.title,
      kategori:          dto.category,
      deskripsi:         dto.description,
      namaClient:        dto.client.name,
      kontak:            dto.client.contact,
      instansi:          dto.client.institution ?? null,
      prioritas:         mapPriorityToApi(dto.priority),
      assignedToUserId:  dto.assignedToUserId ?? session?.user.id ?? '',
      deadline:          deadline.toISOString().split('T')[0],
      tipePembayaran:    mapBillingTypeToApi(dto.billingType ?? 'Reguler'),
      items:             dto.items.map(it => ({
        namaItem:    it.name,
        quantity:    it.quantity,
        satuan:      it.unit,
        hargaSatuan: it.unitPrice,
      })),
      ...(dto.poNumber         ? { nomorPO:    dto.poNumber }         : {}),
      ...(dto.notes            ? { catatan:    dto.notes }            : {}),
      ...(fees?.ppnRate        ? { ppnPersen:  fees.ppnRate,
                                   ppnNominal: Math.round((calcProjectTotal(dto.items) * fees.ppnRate) / 100) } : {}),
      ...(fees?.pphEnabled     ? { pphPersen:  fees.pphRate ?? 0.5,
                                   pphNominal: Math.round((calcProjectTotal(dto.items) * (fees.pphRate ?? 0.5)) / 100) } : {}),
      ...(biayaLainnya.length  ? { biayaLainnya }                    : {}),
      ...(marketingExternal    ? { marketingExternal }               : {}),
    };

    const created = await projectApiFetch<ApiProjectDetail>(BASE, {
      method: 'POST',
      body:   JSON.stringify(body),
    });

    return mapApiProjectDetail(created);
  }

  updateProject(dto: UpdateProjectDTO): Promise<Project> {
    return this.local.updateProject(dto);
  }

  deleteProject(id: string): Promise<void> {
    return this.local.deleteProject(id);
  }

  payTermin(dto: PayTerminDTO): Promise<Project> {
    return this.local.payTermin(dto);
  }
}
