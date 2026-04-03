/**
 * Infrastructure: QuotationRepository
 * In-memory mock implementation for development / demo.
 *
 * Alur status:
 *   Draft → Terkirim → ACC → Dikonversi (ke Project)
 *                   → Ditolak
 */

import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import {
  Quotation,
  QuotationCollection,
  QuotationPagination,
  QuotationStats,
  CreateQuotationDTO,
  UpdateQuotationDTO,
  AccQuotationDTO,
  RejectQuotationDTO,
  canTransition,
  calcQuotationTotal,
} from '@/src/domain/entities/Quotation';
import { Project, ProjectCategory, ProjectPriority } from '@/src/domain/entities/Project';

// ─── Project store reference (shared in-memory) ───────────────────────────────
// Import dan re-export untuk koordinasi antar-repository.
// Pada implementasi nyata (database), ini digantikan oleh FK + transaction.
import { projectsStoreRef, nextProjectIdRef } from './ProjectRepository';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seed: Quotation[] = [
  {
    id: 'QUO-001',
    title: 'Penawaran Jasa Servis & Maintenance Laptop',
    description: 'Penawaran servis & tune-up 15 unit laptop milik instansi BPJS Kesehatan.',
    category: 'Pengadaan Jasa',
    priority: 'Sedang',
    client: { name: 'BPJS Kesehatan Cab. Sidoarjo', contact: '031-8912345', institution: 'BPJS Kesehatan' },
    items: [
      { name: 'Jasa Servis Laptop', quantity: 15, unit: 'unit', unitPrice: 200_000 },
      { name: 'Thermal Paste',      quantity: 15, unit: 'pcs',  unitPrice: 30_000  },
    ],
    totalValue: 15 * 200_000 + 15 * 30_000,
    assignedTo: 'James Wilson',
    status: 'Dikonversi',
    validUntil: new Date('2026-02-28'),
    createdAt:  new Date('2026-02-10'),
    sentAt:     new Date('2026-02-11'),
    accAt:      new Date('2026-02-18'),
    convertedAt: new Date('2026-02-19'),
    convertedProjectId: 'PRJ-003',
    poNumber: 'PO/BPJS/2026/001',
  },
  {
    id: 'QUO-002',
    title: 'Penawaran Instalasi Jaringan LAN Kantor',
    description: 'Penawaran pemasangan kabel LAN, switch, dan konfigurasi jaringan lokal Koperasi Sejahtera.',
    category: 'Pengadaan Jasa',
    priority: 'Tinggi',
    client: { name: 'Koperasi Sejahtera', contact: 'it@kopsejahtera.id' },
    items: [
      { name: 'Kabel UTP Cat6',  quantity: 200, unit: 'meter', unitPrice: 8_000    },
      { name: 'Switch 24-port',  quantity: 2,   unit: 'unit',  unitPrice: 1_500_000 },
      { name: 'Jasa Instalasi',  quantity: 1,   unit: 'paket', unitPrice: 2_500_000 },
    ],
    totalValue: 200 * 8_000 + 2 * 1_500_000 + 2_500_000,
    assignedTo: 'David Kim',
    status: 'Dikonversi',
    validUntil: new Date('2026-01-31'),
    createdAt:  new Date('2026-01-12'),
    sentAt:     new Date('2026-01-13'),
    accAt:      new Date('2026-01-15'),
    convertedAt: new Date('2026-01-16'),
    convertedProjectId: 'PRJ-005',
    notes: 'Tanpa PO — kesepakatan langsung via email.',
  },
  {
    id: 'QUO-003',
    title: 'Penawaran Pengadaan Server & Storage',
    description: 'Penawaran pengadaan 2 unit server rack dan 10TB NAS storage untuk pusat data.',
    category: 'Pengadaan Komputer',
    priority: 'Tinggi',
    client: { name: 'Dinas Kominfo Kota', contact: '082188889999', institution: 'Pemkot Surabaya' },
    items: [
      { name: 'Server Rack 2U',    quantity: 2,  unit: 'unit', unitPrice: 45_000_000 },
      { name: 'NAS Storage 10TB',  quantity: 1,  unit: 'unit', unitPrice: 28_000_000 },
      { name: 'Jasa Instalasi',    quantity: 1,  unit: 'paket', unitPrice: 5_000_000  },
    ],
    totalValue: 2 * 45_000_000 + 28_000_000 + 5_000_000,
    assignedTo: 'Alex Rivera',
    status: 'ACC',
    validUntil: new Date('2026-03-31'),
    createdAt:  new Date('2026-02-20'),
    sentAt:     new Date('2026-02-21'),
    accAt:      new Date('2026-02-28'),
    poNumber: 'PO/KOMINFO/2026/003',
    notes: 'PO sudah diterima. Menunggu konversi ke project.',
  },
  {
    id: 'QUO-004',
    title: 'Penawaran Pengadaan AC Ruangan',
    description: 'Penawaran pengadaan dan pemasangan 8 unit AC split 1.5 PK untuk ruang kerja.',
    category: 'Pengadaan Barang',
    priority: 'Sedang',
    client: { name: 'PT Artha Graha', contact: 'procurement@arthagraha.com', institution: 'PT Artha Graha' },
    items: [
      { name: 'AC Split 1.5 PK',  quantity: 8, unit: 'unit', unitPrice: 4_200_000 },
      { name: 'Jasa Pemasangan',  quantity: 8, unit: 'unit', unitPrice: 350_000   },
    ],
    totalValue: 8 * 4_200_000 + 8 * 350_000,
    assignedTo: 'Sarah Chen',
    status: 'Terkirim',
    validUntil: new Date('2026-03-15'),
    createdAt: new Date('2026-02-25'),
    sentAt:    new Date('2026-02-26'),
    notes: 'Menunggu approval procurement.',
  },
  {
    id: 'QUO-005',
    title: 'Penawaran Jasa Cleaning Service',
    description: 'Penawaran layanan kebersihan gedung kantor selama 3 bulan.',
    category: 'Lainnya',
    priority: 'Rendah',
    client: { name: 'PT Mitra Sejati', contact: 'admin@mitrasejati.id' },
    items: [
      { name: 'Jasa Cleaning Service', quantity: 3, unit: 'bulan', unitPrice: 3_500_000 },
      { name: 'Bahan Kebersihan',       quantity: 3, unit: 'bulan', unitPrice: 500_000   },
    ],
    totalValue: 3 * 3_500_000 + 3 * 500_000,
    assignedTo: 'Maria Garcia',
    status: 'Ditolak',
    validUntil: new Date('2026-02-20'),
    createdAt:  new Date('2026-02-05'),
    sentAt:     new Date('2026-02-06'),
    rejectedAt: new Date('2026-02-14'),
    rejectionReason: 'Budget tidak tersedia untuk periode ini.',
  },
  {
    id: 'QUO-006',
    title: 'Penawaran Pengadaan Meja & Kursi Ergonomis',
    description: 'Penawaran pengadaan furniture ergonomis untuk 20 workstation.',
    category: 'Pengadaan Furniture',
    priority: 'Sedang',
    client: { name: 'Bank Jatim Cab. Malang', contact: 'ga@bankjatim-malang.id', institution: 'Bank Jatim' },
    items: [
      { name: 'Meja Kerja Ergonomis',  quantity: 20, unit: 'unit', unitPrice: 2_800_000 },
      { name: 'Kursi Ergonomis',       quantity: 20, unit: 'unit', unitPrice: 3_200_000 },
    ],
    totalValue: 20 * 2_800_000 + 20 * 3_200_000,
    assignedTo: 'Nina Patel',
    status: 'Draft',
    validUntil: new Date('2026-03-30'),
    createdAt: new Date('2026-03-01'),
    notes: 'Draft awal, belum final.',
  },
];

// ─── In-memory store ──────────────────────────────────────────────────────────

let quotationsStore: Quotation[] = [...seed];
let nextId = seed.length + 1;

// ─── Repository ───────────────────────────────────────────────────────────────

export class QuotationRepository implements IQuotationRepository {

  async getQuotations(
    page: number,
    perPage: number,
    statusFilter?: string,
    search?: string
  ): Promise<QuotationCollection> {
    let list = [...quotationsStore];

    if (statusFilter && statusFilter !== 'Semua')
      list = list.filter(q => q.status === statusFilter);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.client.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      );
    }

    const totalQuotations = list.length;
    const totalPages      = Math.max(1, Math.ceil(totalQuotations / perPage));
    const safePage        = Math.min(Math.max(1, page), totalPages);
    const start           = (safePage - 1) * perPage;
    const paged           = list.slice(start, start + perPage);

    const pagination: QuotationPagination = {
      currentPage: safePage,
      totalPages,
      totalQuotations,
      perPage,
    };

    return new QuotationCollection(paged, pagination);
  }

  async getQuotationById(id: string): Promise<Quotation | null> {
    return quotationsStore.find(q => q.id === id) ?? null;
  }

  async getQuotationStats(): Promise<QuotationStats> {
    const all = quotationsStore;
    return {
      total:             all.length,
      draft:             all.filter(q => q.status === 'Draft').length,
      terkirim:          all.filter(q => q.status === 'Terkirim').length,
      acc:               all.filter(q => q.status === 'ACC').length,
      ditolak:           all.filter(q => q.status === 'Ditolak').length,
      dikonversi:        all.filter(q => q.status === 'Dikonversi').length,
      totalValueACC:     all.filter(q => q.status === 'ACC' || q.status === 'Dikonversi').reduce((s, q) => s + q.totalValue, 0),
      totalValuePending: all.filter(q => q.status === 'Draft' || q.status === 'Terkirim').reduce((s, q) => s + q.totalValue, 0),
    };
  }

  async createQuotation(dto: CreateQuotationDTO): Promise<Quotation> {
    const quotation: Quotation = {
      id:          `QUO-${String(nextId++).padStart(3, '0')}`,
      title:       dto.title,
      description: dto.description,
      category:    dto.category,
      priority:    dto.priority,
      client:      dto.client,
      items:       dto.items,
      totalValue:  calcQuotationTotal(dto.items),
      assignedTo:  dto.assignedTo,
      status:      'Draft',
      validUntil:  new Date(dto.validUntil),
      createdAt:   new Date(),
      notes:       dto.notes,
    };
    quotationsStore.unshift(quotation);
    return quotation;
  }

  async updateQuotation(dto: UpdateQuotationDTO): Promise<Quotation> {
    const idx = quotationsStore.findIndex(q => q.id === dto.id);
    if (idx === -1) throw new Error(`Penawaran ${dto.id} tidak ditemukan.`);

    const existing = quotationsStore[idx];
    if (existing.status !== 'Draft')
      throw new Error('Hanya penawaran berstatus Draft yang dapat diubah.');

    const items = dto.items ?? existing.items;

    const updated: Quotation = {
      ...existing,
      ...(dto.title       && { title:       dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.category    && { category:    dto.category }),
      ...(dto.priority    && { priority:    dto.priority }),
      ...(dto.client      && { client:      dto.client }),
      ...(dto.assignedTo  && { assignedTo:  dto.assignedTo }),
      ...(dto.validUntil  && { validUntil:  new Date(dto.validUntil) }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      items,
      totalValue: calcQuotationTotal(items),
    };

    quotationsStore[idx] = updated;
    return updated;
  }

  async sendQuotation(id: string): Promise<Quotation> {
    const idx = quotationsStore.findIndex(q => q.id === id);
    if (idx === -1) throw new Error(`Penawaran ${id} tidak ditemukan.`);

    const existing = quotationsStore[idx];
    if (!canTransition(existing.status, 'Terkirim'))
      throw new Error(`Tidak dapat mengirim penawaran dengan status "${existing.status}".`);

    const updated: Quotation = { ...existing, status: 'Terkirim', sentAt: new Date() };
    quotationsStore[idx] = updated;
    return updated;
  }

  async accQuotation(dto: AccQuotationDTO): Promise<Quotation> {
    const idx = quotationsStore.findIndex(q => q.id === dto.id);
    if (idx === -1) throw new Error(`Penawaran ${dto.id} tidak ditemukan.`);

    const existing = quotationsStore[idx];
    if (!canTransition(existing.status, 'ACC'))
      throw new Error(`Tidak dapat meng-ACC penawaran dengan status "${existing.status}".`);

    const updated: Quotation = {
      ...existing,
      status: 'ACC',
      accAt:  new Date(),
      ...(dto.poNumber && { poNumber: dto.poNumber }),
    };
    quotationsStore[idx] = updated;
    return updated;
  }

  async rejectQuotation(dto: RejectQuotationDTO): Promise<Quotation> {
    const idx = quotationsStore.findIndex(q => q.id === dto.id);
    if (idx === -1) throw new Error(`Penawaran ${dto.id} tidak ditemukan.`);

    const existing = quotationsStore[idx];
    if (!canTransition(existing.status, 'Ditolak'))
      throw new Error(`Tidak dapat menolak penawaran dengan status "${existing.status}".`);

    const updated: Quotation = {
      ...existing,
      status:     'Ditolak',
      rejectedAt: new Date(),
      ...(dto.reason && { rejectionReason: dto.reason }),
    };
    quotationsStore[idx] = updated;
    return updated;
  }

  async convertToProject(quotationId: string, deadline: Date): Promise<Project> {
    const qIdx = quotationsStore.findIndex(q => q.id === quotationId);
    if (qIdx === -1) throw new Error(`Penawaran ${quotationId} tidak ditemukan.`);

    const quotation = quotationsStore[qIdx];
    if (quotation.status !== 'ACC')
      throw new Error('Hanya penawaran berstatus ACC yang dapat dikonversi ke project.');

    // Buat project baru dari data penawaran
    const projectId = `PRJ-${String(nextProjectIdRef.value++).padStart(3, '0')}`;
    const project: Project = {
      id: projectId,
      title: quotation.title.replace(/^Penawaran\s+/i, ''),
      description: quotation.description,
      category: quotation.category as ProjectCategory,
      status: 'Baru',
      priority: quotation.priority as ProjectPriority,
      client: quotation.client,
      items: quotation.items,
      totalValue: quotation.totalValue,
      assignedTo: quotation.assignedTo,
      createdAt: new Date(),
      deadline: deadline,
      notes: quotation.notes,
      origin: 'quotation',
      quotationId: quotation.id,
      ...(quotation.poNumber && { poNumber: quotation.poNumber }),
      grandTotal: 0,
      billingType: 'Reguler'
    };

    projectsStoreRef.value.unshift(project);

    // Tandai penawaran sebagai Dikonversi
    quotationsStore[qIdx] = {
      ...quotation,
      status:             'Dikonversi',
      convertedAt:        new Date(),
      convertedProjectId: projectId,
    };

    return project;
  }

  async deleteQuotation(id: string): Promise<void> {
    const q = quotationsStore.find(item => item.id === id);
    if (q && q.status !== 'Draft')
      throw new Error('Hanya penawaran berstatus Draft yang dapat dihapus.');
    quotationsStore = quotationsStore.filter(item => item.id !== id);
  }
}
