/**
 * Infrastructure: ProjectRepository
 * In-memory mock implementation for development / demo.
 */

import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';
import {
  Project,
  ProjectCollection,
  ProjectStats,
  ProjectPagination,
  ProjectCategory,
  ProjectStatus,
  ProjectPriority,
  CreateProjectDTO,
  UpdateProjectDTO,
  PayTerminDTO,
  Termin,
  TerminStatus,
  ExternalMarketer,
  calcProjectTotal,
  calcGrandTotal,
} from '@/src/domain/entities/Project';
import { Transaction, TransactionCategory } from '@/src/domain/entities/Finance';
import { txStoreRef, nextTxIdRef } from './FinanceRepository';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seed: Project[] = [
  {
    id: 'PRJ-001',
    title: 'Pengadaan Komputer Kantor Dinas',
    description: 'Pengadaan 20 unit komputer desktop untuk kebutuhan operasional kantor dinas.',
    category: 'Pengadaan Komputer',
    status: 'Proses',
    priority: 'Tinggi',
    billingType: 'Reguler',
    client: { name: 'Dinas Pendidikan Kota', contact: '082111222333', institution: 'Pemkot Surabaya' },
    items: [
      { name: 'PC Desktop Core i5', quantity: 20, unit: 'unit', unitPrice: 7_500_000 },
      { name: 'Monitor 24"',        quantity: 20, unit: 'unit', unitPrice: 1_800_000 },
    ],
    totalValue: 20 * 7_500_000 + 20 * 1_800_000,
    additionalFees: {
      ppnRate: 11,
      pphEnabled: true,
      pphRate: 1.5,
      eMateraiEnabled: true,
      eMateraiAmount: 10_000,
    },
    grandTotal: calcGrandTotal(20 * 7_500_000 + 20 * 1_800_000, { ppnRate: 11, pphEnabled: true, pphRate: 1.5 }),
    assignedTo: 'Alex Rivera',
    createdAt: new Date('2026-02-01'),
    deadline:  new Date('2026-03-15'),
    notes: 'Termasuk instalasi OS & software perkantoran.',
    poNumber: 'PO/DIKNAS/2026/012',
    origin: 'direct',
    externalMarketer: {
      name:       'Rizky Pratama',
      contact:    '081234567890',
      feeType:    'percent',
      feePercent: 3,
      notes:      'Referral dari kenalan di Dinas Pendidikan',
    } satisfies ExternalMarketer,
  },
  {
    id: 'PRJ-002',
    title: 'Pengadaan ATK Triwulan I',
    description: 'Pengadaan alat tulis kantor untuk kebutuhan 3 bulan pertama.',
    category: 'Pengadaan ATK',
    status: 'Selesai',
    priority: 'Sedang',
    billingType: 'Reguler',
    client: { name: 'PT Maju Bersama', contact: 'admin@majubersama.co.id', institution: 'PT Maju Bersama' },
    items: [
      { name: 'Kertas HVS A4 70gr', quantity: 50,  unit: 'rim',  unitPrice: 55_000 },
      { name: 'Ballpoint',          quantity: 200, unit: 'pcs',  unitPrice: 5_000  },
      { name: 'Tinta Printer',      quantity: 10,  unit: 'set',  unitPrice: 120_000 },
    ],
    totalValue: 50 * 55_000 + 200 * 5_000 + 10 * 120_000,
    grandTotal: 50 * 55_000 + 200 * 5_000 + 10 * 120_000,
    assignedTo: 'Sarah Chen',
    createdAt:   new Date('2026-01-10'),
    deadline:    new Date('2026-01-31'),
    completedAt: new Date('2026-01-28'),
    origin: 'direct',
  },
  {
    id: 'PRJ-003',
    title: 'Jasa Servis & Maintenance Laptop',
    description: 'Servis & tune-up 15 unit laptop milik instansi.',
    category: 'Pengadaan Jasa',
    status: 'Baru',
    priority: 'Sedang',
    billingType: 'Reguler',
    client: { name: 'BPJS Kesehatan Cab. Sidoarjo', contact: '031-8912345', institution: 'BPJS Kesehatan' },
    items: [
      { name: 'Jasa Servis Laptop', quantity: 15, unit: 'unit', unitPrice: 200_000 },
      { name: 'Thermal Paste',      quantity: 15, unit: 'pcs',  unitPrice: 30_000  },
    ],
    totalValue: 15 * 200_000 + 15 * 30_000,
    grandTotal: 15 * 200_000 + 15 * 30_000,
    assignedTo: 'James Wilson',
    createdAt: new Date('2026-02-25'),
    deadline:  new Date('2026-03-10'),
    origin: 'quotation',
    quotationId: 'QUO-001',
    poNumber: 'PO/BPJS/2026/001',
  },
  {
    id: 'PRJ-004',
    title: 'Pengadaan Furniture Ruang Rapat',
    description: 'Pengadaan meja, kursi, dan lemari arsip untuk ruang rapat baru.',
    category: 'Pengadaan Furniture',
    status: 'Proses',
    priority: 'Rendah',
    billingType: 'Reguler',
    client: { name: 'Kelurahan Wonokromo', contact: '082399988877', institution: 'Pemkot Surabaya' },
    items: [
      { name: 'Meja Rapat',    quantity: 1,  unit: 'unit', unitPrice: 3_500_000 },
      { name: 'Kursi Rapat',   quantity: 10, unit: 'unit', unitPrice: 850_000   },
      { name: 'Lemari Arsip',  quantity: 2,  unit: 'unit', unitPrice: 1_200_000 },
    ],
    totalValue: 3_500_000 + 10 * 850_000 + 2 * 1_200_000,
    additionalFees: {
      ppnRate: 11,
      pphEnabled: true,
      pphRate: 2,
      materaiEnabled: true,
      materaiAmount: 10_000,
      eSignEnabled: true,
      eSignAmount: 50_000,
    },
    grandTotal: calcGrandTotal(3_500_000 + 10 * 850_000 + 2 * 1_200_000, { ppnRate: 11, pphEnabled: true, pphRate: 2 }),
    assignedTo: 'Maria Garcia',
    createdAt: new Date('2026-02-10'),
    deadline:  new Date('2026-03-20'),
    poNumber: 'PO/WONOKROMO/2026/003',
    origin: 'direct',
  },
  {
    id: 'PRJ-005',
    title: 'Instalasi Jaringan LAN Kantor',
    description: 'Pemasangan kabel LAN, switch, dan konfigurasi jaringan lokal.',
    category: 'Pengadaan Jasa',
    status: 'Selesai',
    priority: 'Tinggi',
    billingType: 'Reguler',
    client: { name: 'Koperasi Sejahtera', contact: 'it@kopsejahtera.id' },
    items: [
      { name: 'Kabel UTP Cat6',  quantity: 200, unit: 'meter', unitPrice: 8_000    },
      { name: 'Switch 24-port',  quantity: 2,   unit: 'unit',  unitPrice: 1_500_000 },
      { name: 'Jasa Instalasi',  quantity: 1,   unit: 'paket', unitPrice: 2_500_000 },
    ],
    totalValue: 200 * 8_000 + 2 * 1_500_000 + 2_500_000,
    grandTotal: 200 * 8_000 + 2 * 1_500_000 + 2_500_000,
    assignedTo: 'David Kim',
    createdAt:   new Date('2026-01-20'),
    deadline:    new Date('2026-02-10'),
    completedAt: new Date('2026-02-08'),
    origin: 'quotation',
    quotationId: 'QUO-002',
  },
  {
    id: 'PRJ-006',
    title: 'Pengadaan Printer & Scanner',
    description: 'Pengadaan 5 unit printer multifungsi & 3 unit scanner dokumen.',
    category: 'Pengadaan Barang',
    status: 'Baru',
    priority: 'Sedang',
    billingType: 'Reguler',
    client: { name: 'Rumah Sakit Bhayangkara', contact: '031-5671234', institution: 'RS Bhayangkara' },
    items: [
      { name: 'Printer Multifungsi A3', quantity: 5, unit: 'unit', unitPrice: 4_500_000 },
      { name: 'Scanner Dokumen A4',     quantity: 3, unit: 'unit', unitPrice: 2_200_000 },
    ],
    totalValue: 5 * 4_500_000 + 3 * 2_200_000,
    grandTotal: 5 * 4_500_000 + 3 * 2_200_000,
    assignedTo: 'Nina Patel',
    createdAt: new Date('2026-02-27'),
    deadline:  new Date('2026-03-25'),
    origin: 'direct',
  },
  {
    id: 'PRJ-007',
    title: 'Pengadaan UPS & Stabilizer',
    description: 'Pengadaan UPS 1200VA dan stabilizer untuk 10 titik komputer.',
    category: 'Pengadaan Barang',
    status: 'Dibatalkan',
    priority: 'Rendah',
    billingType: 'Reguler',
    client: { name: 'Sekolah Negeri 05', contact: '081234567890', institution: 'Dinas Pendidikan' },
    items: [
      { name: 'UPS 1200VA',    quantity: 10, unit: 'unit', unitPrice: 650_000 },
      { name: 'Stabilizer 5A', quantity: 10, unit: 'unit', unitPrice: 350_000 },
    ],
    totalValue: 10 * 650_000 + 10 * 350_000,
    grandTotal: 10 * 650_000 + 10 * 350_000,
    assignedTo: 'Lisa Park',
    createdAt: new Date('2026-01-15'),
    deadline:  new Date('2026-02-01'),
    notes: 'Dibatalkan oleh klien karena perubahan anggaran.',
    origin: 'direct',
  },
  // ── Sewa ──────────────────────────────────────────────────────────────────
  {
    id: 'PRJ-008',
    title: 'Jasa Pembuatan & Hosting Website Profil',
    description: 'Pembuatan website profil perusahaan, hosting + domain 1 tahun. Biaya sewa tahunan untuk maintenance & hosting.',
    category: 'Lainnya',
    status: 'Proses',
    priority: 'Tinggi',
    billingType: 'Sewa',
    client: { name: 'CV Karya Mandiri', contact: 'owner@karyamandiri.id' },
    items: [
      { name: 'Desain & Pengembangan Website', quantity: 1, unit: 'paket', unitPrice: 8_000_000 },
      { name: 'Hosting + Domain 1 Tahun',      quantity: 1, unit: 'tahun', unitPrice: 500_000   },
    ],
    totalValue: 8_500_000,
    grandTotal: 8_500_000,
    assignedTo: 'Tom Brown',
    createdAt:     new Date('2026-02-15'),
    deadline:      new Date('2026-04-01'),
    sewaStartDate: new Date('2026-04-01'),
    sewaEndDate:   new Date('2027-04-01'),
    renewalMonths: 12,
    origin: 'direct',
  },
  // ── Termin ────────────────────────────────────────────────────────────────
  {
    id: 'PRJ-009',
    title: 'Instalasi PLTS Atap 10 kWp',
    description: 'Pemasangan sistem Pembangkit Listrik Tenaga Surya (PLTS) atap kapasitas 10 kWp beserta inverter dan instalasi kabel AC/DC.',
    category: 'Pengadaan Jasa',
    status: 'Proses',
    priority: 'Tinggi',
    billingType: 'Termin',
    client: { name: 'PT Anugerah Energi', contact: 'project@anugerahenergi.co.id', institution: 'PT Anugerah Energi' },
    items: [
      { name: 'Panel Surya 500Wp Monocrystalline', quantity: 20,  unit: 'unit',  unitPrice: 2_800_000 },
      { name: 'Inverter On-Grid 10 kW',            quantity: 1,   unit: 'unit',  unitPrice: 12_000_000 },
      { name: 'Kabel PV + MC4 Connector',          quantity: 1,   unit: 'paket', unitPrice: 3_500_000 },
      { name: 'Struktur Mounting Atap Baja',        quantity: 1,   unit: 'paket', unitPrice: 5_000_000 },
      { name: 'Jasa Instalasi & Komisioning',       quantity: 1,   unit: 'paket', unitPrice: 8_500_000 },
    ],
    totalValue: 20 * 2_800_000 + 12_000_000 + 3_500_000 + 5_000_000 + 8_500_000,
    grandTotal: 20 * 2_800_000 + 12_000_000 + 3_500_000 + 5_000_000 + 8_500_000,
    assignedTo: 'David Kim',
    createdAt: new Date('2026-01-10'),
    deadline:  new Date('2026-04-30'),
    poNumber:  'PO/AE/2026/001',
    origin: 'direct',
    termins: [
      {
        id:         'TRM-009-1',
        label:      'DP (30%)',
        percentage: 30,
        amount:     Math.round((20 * 2_800_000 + 12_000_000 + 3_500_000 + 5_000_000 + 8_500_000) * 0.30),
        dueDate:    new Date('2026-01-20'),
        status:     'Lunas',
        paidAt:     new Date('2026-01-18'),
        paymentMethod: 'Transfer Bank',
        notes: 'DP sesuai SPK',
      },
      {
        id:         'TRM-009-2',
        label:      'Termin 2 — Pengiriman Material (40%)',
        percentage: 40,
        amount:     Math.round((20 * 2_800_000 + 12_000_000 + 3_500_000 + 5_000_000 + 8_500_000) * 0.40),
        dueDate:    new Date('2026-03-01'),
        status:     'Lunas',
        paidAt:     new Date('2026-02-28'),
        paymentMethod: 'Transfer Bank',
      },
      {
        id:         'TRM-009-3',
        label:      'Pelunasan — Selesai Instalasi (30%)',
        percentage: 30,
        amount:     Math.round((20 * 2_800_000 + 12_000_000 + 3_500_000 + 5_000_000 + 8_500_000) * 0.30),
        dueDate:    new Date('2026-04-30'),
        status:     'Belum Dibayar',
      },
    ],
    externalMarketer: {
      name:      'Hendri Susanto',
      contact:   '082211334455',
      feeType:   'flat',
      feeAmount: 5_000_000,
      notes:     'Konsultan energi, memperkenalkan ke PT Anugerah Energi',
    } satisfies ExternalMarketer,
  },
  {
    id: 'PRJ-010',
    title: 'Instalasi PLTS Komunal Desa 20 kWp',
    description: 'Pembangunan PLTS komunal untuk elektrifikasi desa dengan kapasitas 20 kWp, termasuk baterai penyimpanan.',
    category: 'Pengadaan Jasa',
    status: 'Baru',
    priority: 'Tinggi',
    billingType: 'Termin',
    client: { name: 'Dinas ESDM Kab. Mojokerto', contact: '0321-456789', institution: 'Pemkab Mojokerto' },
    items: [
      { name: 'Panel Surya 500Wp', quantity: 40,  unit: 'unit',  unitPrice: 2_800_000 },
      { name: 'Inverter Off-Grid 20 kW', quantity: 1, unit: 'unit', unitPrice: 25_000_000 },
      { name: 'Baterai LiFePO4 100Ah',  quantity: 20, unit: 'unit', unitPrice: 8_500_000 },
      { name: 'Instalasi & Komisioning', quantity: 1, unit: 'paket', unitPrice: 15_000_000 },
    ],
    totalValue: 40 * 2_800_000 + 25_000_000 + 20 * 8_500_000 + 15_000_000,
    grandTotal: 40 * 2_800_000 + 25_000_000 + 20 * 8_500_000 + 15_000_000,
    assignedTo: 'Alex Rivera',
    createdAt: new Date('2026-03-01'),
    deadline:  new Date('2026-08-31'),
    poNumber:  'PO/ESDM/2026/003',
    origin: 'direct',
    termins: [
      {
        id:         'TRM-010-1',
        label:      'DP (25%)',
        percentage: 25,
        amount:     Math.round((40 * 2_800_000 + 25_000_000 + 20 * 8_500_000 + 15_000_000) * 0.25),
        dueDate:    new Date('2026-03-20'),
        status:     'Belum Dibayar',
      },
      {
        id:         'TRM-010-2',
        label:      'Termin 2 — Pengiriman Material (35%)',
        percentage: 35,
        amount:     Math.round((40 * 2_800_000 + 25_000_000 + 20 * 8_500_000 + 15_000_000) * 0.35),
        dueDate:    new Date('2026-05-31'),
        status:     'Belum Dibayar',
      },
      {
        id:         'TRM-010-3',
        label:      'Termin 3 — Progress 75% (25%)',
        percentage: 25,
        amount:     Math.round((40 * 2_800_000 + 25_000_000 + 20 * 8_500_000 + 15_000_000) * 0.25),
        dueDate:    new Date('2026-07-31'),
        status:     'Belum Dibayar',
      },
      {
        id:         'TRM-010-4',
        label:      'Pelunasan — BAST (15%)',
        percentage: 15,
        amount:     Math.round((40 * 2_800_000 + 25_000_000 + 20 * 8_500_000 + 15_000_000) * 0.15),
        dueDate:    new Date('2026-08-31'),
        status:     'Belum Dibayar',
      },
    ],
  },
];

// ─── Repository ───────────────────────────────────────────────────────────────

let projectsStore: Project[] = [...seed];
let nextId = seed.length + 1;

/**
 * Shared mutable refs — digunakan oleh QuotationRepository.convertToProject
 * agar konversi penawaran bisa langsung menulis ke store project yang sama.
 */
export const projectsStoreRef = { get value() { return projectsStore; }, set value(v: Project[]) { projectsStore = v; } };
export const nextProjectIdRef  = { get value() { return nextId; },         set value(v: number)    { nextId = v; }         };

export class ProjectRepository implements IProjectRepository {

  async getProjects(
    page: number,
    perPage: number,
    statusFilter?: string,
    categoryFilter?: string,
    search?: string,
    billingTypeFilter?: string,
  ): Promise<ProjectCollection> {
    let list = [...projectsStore];

    if (statusFilter && statusFilter !== 'Semua')
      list = list.filter(p => p.status === statusFilter);

    if (categoryFilter && categoryFilter !== 'Semua')
      list = list.filter(p => p.category === categoryFilter);

    if (billingTypeFilter && billingTypeFilter !== 'Semua')
      list = list.filter(p => (p.billingType ?? 'Reguler') === billingTypeFilter);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.client.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    const totalProjects = list.length;
    const totalPages    = Math.max(1, Math.ceil(totalProjects / perPage));
    const safePage      = Math.min(Math.max(1, page), totalPages);
    const start         = (safePage - 1) * perPage;
    const paged         = list.slice(start, start + perPage);

    const pagination: ProjectPagination = {
      currentPage:   safePage,
      totalPages,
      totalProjects,
      perPage
    };

    return new ProjectCollection(paged, pagination);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return projectsStore.find(p => p.id === id) ?? null;
  }

  async getProjectStats(): Promise<ProjectStats> {
    const all = projectsStore;
    return {
      total:       all.length,
      baru:        all.filter(p => p.status === 'Baru').length,
      proses:      all.filter(p => p.status === 'Proses').length,
      selesai:     all.filter(p => p.status === 'Selesai').length,
      dibayar:     all.filter(p => p.status === 'Dibayar').length,
      dibatalkan:  all.filter(p => p.status === 'Dibatalkan').length,
      totalValue:  all.filter(p => p.status !== 'Dibatalkan').reduce((s, p) => s + p.totalValue, 0),
    };
  }

  async createProject(dto: CreateProjectDTO): Promise<Project> {
    const billingType = dto.billingType ?? 'Reguler';

    // Build termin list for Termin billing type
    const termins: Termin[] | undefined =
      billingType === 'Termin' && dto.termins
        ? dto.termins.map((t, i) => ({
            ...t,
            id:     `TRM-${String(nextId).padStart(3, '0')}-${i + 1}`,
            status: 'Belum Dibayar' as TerminStatus,
          }))
        : undefined;

    const project: Project = {
      id:          `PRJ-${String(nextId++).padStart(3, '0')}`,
      title:       dto.title,
      description: dto.description,
      category:    dto.category as ProjectCategory,
      status:      'Baru',
      priority:    dto.priority as ProjectPriority,
      billingType,
      client:      dto.client,
      items:       dto.items,
      totalValue:  calcProjectTotal(dto.items),
      grandTotal:  calcGrandTotal(calcProjectTotal(dto.items), dto.additionalFees),
      additionalFees: dto.additionalFees,
      assignedTo:  dto.assignedTo,
      createdAt:   new Date(),
      deadline:    new Date(dto.deadline),
      notes:       dto.notes,
      origin:      dto.origin ?? 'direct',
      ...(dto.quotationId && { quotationId: dto.quotationId }),
      ...(dto.poNumber    && { poNumber:    dto.poNumber    }),
      ...(termins         && { termins }),
      ...(billingType === 'Sewa' && dto.sewaStartDate && {
        sewaStartDate: new Date(dto.sewaStartDate),
        sewaEndDate:   dto.sewaEndDate ? new Date(dto.sewaEndDate) : undefined,
        renewalMonths: dto.renewalMonths ?? 12,
      }),
      ...(dto.externalMarketer !== undefined && { externalMarketer: dto.externalMarketer || undefined }),
    };
    projectsStore.unshift(project);
    return project;
  }

  async updateProject(dto: UpdateProjectDTO): Promise<Project> {
    const idx = projectsStore.findIndex(p => p.id === dto.id);
    if (idx === -1) throw new Error(`Project ${dto.id} tidak ditemukan.`);

    const existing = projectsStore[idx];
    const items    = dto.items ?? existing.items;
    const now      = new Date();

    const updated: Project = {
      ...existing,
      ...(dto.title       && { title:       dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.category    && { category:    dto.category as ProjectCategory }),
      ...(dto.status      && { status:      dto.status  as ProjectStatus  }),
      ...(dto.priority    && { priority:    dto.priority as ProjectPriority }),
      ...(dto.client      && { client:      dto.client }),
      ...(dto.assignedTo  && { assignedTo:  dto.assignedTo }),
      ...(dto.deadline    && { deadline:    new Date(dto.deadline) }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.poNumber !== undefined && { poNumber: dto.poNumber }),
      items,
      totalValue: calcProjectTotal(items),
      grandTotal: calcGrandTotal(calcProjectTotal(items), dto.additionalFees ?? existing.additionalFees),
      ...(dto.additionalFees !== undefined && { additionalFees: dto.additionalFees }),
      ...(dto.externalMarketer !== undefined && { externalMarketer: dto.externalMarketer || undefined }),
      // Mark completed timestamp when reaching Selesai
      ...(dto.status === 'Selesai' && !existing.completedAt && { completedAt: now }),
      // Mark paid timestamp + payment info when reaching Dibayar
      ...(dto.status === 'Dibayar' && {
        completedAt:   existing.completedAt ?? now,
        paidAt:        now,
        paymentMethod: dto.paymentMethod ?? 'Transfer Bank',
        paymentNotes:  dto.paymentNotes,
      }),
    };

    projectsStore[idx] = updated;

    // ── Auto-create finance transaction when project is marked as Dibayar ──
    if (dto.status === 'Dibayar' && existing.status !== 'Dibayar') {
      const categoryMap: Record<string, TransactionCategory> = {
        'Pengadaan Jasa':      'Pendapatan Jasa',
        'Pengadaan Barang':    'Pendapatan Barang',
        'Pengadaan ATK':       'Pendapatan Barang',
        'Pengadaan Komputer':  'Pendapatan Barang',
        'Pengadaan Furniture': 'Pendapatan Barang',
        'Lainnya':             'Pendapatan Lainnya',
      };
      const txCategory: TransactionCategory =
        categoryMap[updated.category] ?? 'Pendapatan Lainnya';

      const newTx: Transaction = {
        id:            `TRX-${String(nextTxIdRef.value++).padStart(3, '0')}`,
        date:          now,
        type:          'Pemasukan',
        category:      txCategory,
        description:   `Pembayaran ${updated.title} [${updated.id}]`,
        amount:        updated.totalValue,
        paymentMethod: (dto.paymentMethod ?? 'Transfer Bank') as Transaction['paymentMethod'],
        referenceNo:   updated.poNumber,
        projectId:     updated.id,
        createdBy:     updated.assignedTo,
        ...(dto.paymentNotes && { notes: dto.paymentNotes } as object),
      };
      txStoreRef.value = [newTx, ...txStoreRef.value];
    }

    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    projectsStore = projectsStore.filter(p => p.id !== id);
  }

  async payTermin(dto: PayTerminDTO): Promise<Project> {
    const idx = projectsStore.findIndex(p => p.id === dto.projectId);
    if (idx === -1) throw new Error(`Project ${dto.projectId} tidak ditemukan.`);

    const project = projectsStore[idx];
    if (project.billingType !== 'Termin' || !project.termins)
      throw new Error(`Project ${dto.projectId} bukan tipe Termin.`);

    const terminIdx = project.termins.findIndex(t => t.id === dto.terminId);
    if (terminIdx === -1) throw new Error(`Termin ${dto.terminId} tidak ditemukan.`);

    const termin = project.termins[terminIdx];
    if (termin.status === 'Lunas') throw new Error(`Termin ${dto.terminId} sudah lunas.`);

    const now = new Date();
    const updatedTermin: Termin = {
      ...termin,
      status:        'Lunas',
      paidAt:        now,
      paymentMethod: dto.paymentMethod,
      ...(dto.notes && { notes: dto.notes }),
    };
    const updatedTermins = [...project.termins];
    updatedTermins[terminIdx] = updatedTermin;

    // Check if all termins are now paid → mark project as Dibayar
    const allPaid = updatedTermins.every(t => t.status === 'Lunas');
    const updatedProject: Project = {
      ...project,
      termins:     updatedTermins,
      ...(allPaid && {
        status:        'Dibayar',
        completedAt:   project.completedAt ?? now,
        paidAt:        now,
        paymentMethod: dto.paymentMethod,
      }),
    };
    projectsStore[idx] = updatedProject;

    // ── Auto-create finance transaction for this termin ────────────────────
    const categoryMap: Record<string, TransactionCategory> = {
      'Pengadaan Jasa':      'Pendapatan Jasa',
      'Pengadaan Barang':    'Pendapatan Barang',
      'Pengadaan ATK':       'Pendapatan Barang',
      'Pengadaan Komputer':  'Pendapatan Barang',
      'Pengadaan Furniture': 'Pendapatan Barang',
      'Lainnya':             'Pendapatan Lainnya',
    };
    const txCategory: TransactionCategory =
      categoryMap[updatedProject.category] ?? 'Pendapatan Lainnya';

    const newTx: Transaction = {
      id:            `TRX-${String(nextTxIdRef.value++).padStart(3, '0')}`,
      date:          now,
      type:          'Pemasukan',
      category:      txCategory,
      description:   `${updatedTermin.label} — ${updatedProject.title} [${updatedProject.id}]`,
      amount:        updatedTermin.amount,
      paymentMethod: dto.paymentMethod as Transaction['paymentMethod'],
      referenceNo:   updatedProject.poNumber,
      projectId:     updatedProject.id,
      createdBy:     updatedProject.assignedTo,
      ...(dto.notes && { notes: dto.notes } as object),
    };
    txStoreRef.value = [newTx, ...txStoreRef.value];

    return updatedProject;
  }
}
