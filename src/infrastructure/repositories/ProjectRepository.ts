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
  calcProjectTotal
} from '@/src/domain/entities/Project';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seed: Project[] = [
  {
    id: 'PRJ-001',
    title: 'Pengadaan Komputer Kantor Dinas',
    description: 'Pengadaan 20 unit komputer desktop untuk kebutuhan operasional kantor dinas.',
    category: 'Pengadaan Komputer',
    status: 'Proses',
    priority: 'Tinggi',
    client: { name: 'Dinas Pendidikan Kota', contact: '082111222333', institution: 'Pemkot Surabaya' },
    items: [
      { name: 'PC Desktop Core i5', quantity: 20, unit: 'unit', unitPrice: 7_500_000 },
      { name: 'Monitor 24"',        quantity: 20, unit: 'unit', unitPrice: 1_800_000 },
    ],
    totalValue: 20 * 7_500_000 + 20 * 1_800_000,
    assignedTo: 'Alex Rivera',
    createdAt: new Date('2026-02-01'),
    deadline:  new Date('2026-03-15'),
    notes: 'Termasuk instalasi OS & software perkantoran.'
  },
  {
    id: 'PRJ-002',
    title: 'Pengadaan ATK Triwulan I',
    description: 'Pengadaan alat tulis kantor untuk kebutuhan 3 bulan pertama.',
    category: 'Pengadaan ATK',
    status: 'Selesai',
    priority: 'Sedang',
    client: { name: 'PT Maju Bersama', contact: 'admin@majubersama.co.id', institution: 'PT Maju Bersama' },
    items: [
      { name: 'Kertas HVS A4 70gr', quantity: 50,  unit: 'rim',  unitPrice: 55_000 },
      { name: 'Ballpoint',          quantity: 200, unit: 'pcs',  unitPrice: 5_000  },
      { name: 'Tinta Printer',      quantity: 10,  unit: 'set',  unitPrice: 120_000 },
    ],
    totalValue: 50 * 55_000 + 200 * 5_000 + 10 * 120_000,
    assignedTo: 'Sarah Chen',
    createdAt:   new Date('2026-01-10'),
    deadline:    new Date('2026-01-31'),
    completedAt: new Date('2026-01-28'),
  },
  {
    id: 'PRJ-003',
    title: 'Jasa Servis & Maintenance Laptop',
    description: 'Servis & tune-up 15 unit laptop milik instansi.',
    category: 'Pengadaan Jasa',
    status: 'Baru',
    priority: 'Sedang',
    client: { name: 'BPJS Kesehatan Cab. Sidoarjo', contact: '031-8912345', institution: 'BPJS Kesehatan' },
    items: [
      { name: 'Jasa Servis Laptop', quantity: 15, unit: 'unit', unitPrice: 200_000 },
      { name: 'Thermal Paste',      quantity: 15, unit: 'pcs',  unitPrice: 30_000  },
    ],
    totalValue: 15 * 200_000 + 15 * 30_000,
    assignedTo: 'James Wilson',
    createdAt: new Date('2026-02-25'),
    deadline:  new Date('2026-03-10'),
  },
  {
    id: 'PRJ-004',
    title: 'Pengadaan Furniture Ruang Rapat',
    description: 'Pengadaan meja, kursi, dan lemari arsip untuk ruang rapat baru.',
    category: 'Pengadaan Furniture',
    status: 'Proses',
    priority: 'Rendah',
    client: { name: 'Kelurahan Wonokromo', contact: '082399988877', institution: 'Pemkot Surabaya' },
    items: [
      { name: 'Meja Rapat',    quantity: 1,  unit: 'unit', unitPrice: 3_500_000 },
      { name: 'Kursi Rapat',   quantity: 10, unit: 'unit', unitPrice: 850_000   },
      { name: 'Lemari Arsip',  quantity: 2,  unit: 'unit', unitPrice: 1_200_000 },
    ],
    totalValue: 3_500_000 + 10 * 850_000 + 2 * 1_200_000,
    assignedTo: 'Maria Garcia',
    createdAt: new Date('2026-02-10'),
    deadline:  new Date('2026-03-20'),
  },
  {
    id: 'PRJ-005',
    title: 'Instalasi Jaringan LAN Kantor',
    description: 'Pemasangan kabel LAN, switch, dan konfigurasi jaringan lokal.',
    category: 'Pengadaan Jasa',
    status: 'Selesai',
    priority: 'Tinggi',
    client: { name: 'Koperasi Sejahtera', contact: 'it@kopsejahtera.id' },
    items: [
      { name: 'Kabel UTP Cat6',  quantity: 200, unit: 'meter', unitPrice: 8_000    },
      { name: 'Switch 24-port',  quantity: 2,   unit: 'unit',  unitPrice: 1_500_000 },
      { name: 'Jasa Instalasi',  quantity: 1,   unit: 'paket', unitPrice: 2_500_000 },
    ],
    totalValue: 200 * 8_000 + 2 * 1_500_000 + 2_500_000,
    assignedTo: 'David Kim',
    createdAt:   new Date('2026-01-20'),
    deadline:    new Date('2026-02-10'),
    completedAt: new Date('2026-02-08'),
  },
  {
    id: 'PRJ-006',
    title: 'Pengadaan Printer & Scanner',
    description: 'Pengadaan 5 unit printer multifungsi & 3 unit scanner dokumen.',
    category: 'Pengadaan Barang',
    status: 'Baru',
    priority: 'Sedang',
    client: { name: 'Rumah Sakit Bhayangkara', contact: '031-5671234', institution: 'RS Bhayangkara' },
    items: [
      { name: 'Printer Multifungsi A3', quantity: 5, unit: 'unit', unitPrice: 4_500_000 },
      { name: 'Scanner Dokumen A4',     quantity: 3, unit: 'unit', unitPrice: 2_200_000 },
    ],
    totalValue: 5 * 4_500_000 + 3 * 2_200_000,
    assignedTo: 'Nina Patel',
    createdAt: new Date('2026-02-27'),
    deadline:  new Date('2026-03-25'),
  },
  {
    id: 'PRJ-007',
    title: 'Pengadaan UPS & Stabilizer',
    description: 'Pengadaan UPS 1200VA dan stabilizer untuk 10 titik komputer.',
    category: 'Pengadaan Barang',
    status: 'Dibatalkan',
    priority: 'Rendah',
    client: { name: 'Sekolah Negeri 05', contact: '081234567890', institution: 'Dinas Pendidikan' },
    items: [
      { name: 'UPS 1200VA',    quantity: 10, unit: 'unit', unitPrice: 650_000 },
      { name: 'Stabilizer 5A', quantity: 10, unit: 'unit', unitPrice: 350_000 },
    ],
    totalValue: 10 * 650_000 + 10 * 350_000,
    assignedTo: 'Lisa Park',
    createdAt: new Date('2026-01-15'),
    deadline:  new Date('2026-02-01'),
    notes: 'Dibatalkan oleh klien karena perubahan anggaran.'
  },
  {
    id: 'PRJ-008',
    title: 'Jasa Pembuatan Website Profil',
    description: 'Pembuatan website profil perusahaan beserta hosting 1 tahun.',
    category: 'Lainnya',
    status: 'Proses',
    priority: 'Tinggi',
    client: { name: 'CV Karya Mandiri', contact: 'owner@karyamandiri.id' },
    items: [
      { name: 'Desain & Pengembangan Website', quantity: 1, unit: 'paket', unitPrice: 8_000_000 },
      { name: 'Hosting + Domain 1 Tahun',      quantity: 1, unit: 'paket', unitPrice: 500_000   },
    ],
    totalValue: 8_500_000,
    assignedTo: 'Tom Brown',
    createdAt: new Date('2026-02-15'),
    deadline:  new Date('2026-04-01'),
  },
];

// ─── Repository ───────────────────────────────────────────────────────────────

let projectsStore: Project[] = [...seed];
let nextId = seed.length + 1;

export class ProjectRepository implements IProjectRepository {

  async getProjects(
    page: number,
    perPage: number,
    statusFilter?: string,
    categoryFilter?: string,
    search?: string
  ): Promise<ProjectCollection> {
    let list = [...projectsStore];

    if (statusFilter && statusFilter !== 'Semua')
      list = list.filter(p => p.status === statusFilter);

    if (categoryFilter && categoryFilter !== 'Semua')
      list = list.filter(p => p.category === categoryFilter);

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
      dibatalkan:  all.filter(p => p.status === 'Dibatalkan').length,
      totalValue:  all.filter(p => p.status !== 'Dibatalkan').reduce((s, p) => s + p.totalValue, 0),
    };
  }

  async createProject(dto: CreateProjectDTO): Promise<Project> {
    const project: Project = {
      id:          `PRJ-${String(nextId++).padStart(3, '0')}`,
      title:       dto.title,
      description: dto.description,
      category:    dto.category as ProjectCategory,
      status:      'Baru',
      priority:    dto.priority as ProjectPriority,
      client:      dto.client,
      items:       dto.items,
      totalValue:  calcProjectTotal(dto.items),
      assignedTo:  dto.assignedTo,
      createdAt:   new Date(),
      deadline:    new Date(dto.deadline),
      notes:       dto.notes,
    };
    projectsStore.unshift(project);
    return project;
  }

  async updateProject(dto: UpdateProjectDTO): Promise<Project> {
    const idx = projectsStore.findIndex(p => p.id === dto.id);
    if (idx === -1) throw new Error(`Project ${dto.id} tidak ditemukan.`);

    const existing = projectsStore[idx];
    const items    = dto.items ?? existing.items;

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
      items,
      totalValue: calcProjectTotal(items),
      ...(dto.status === 'Selesai' && !existing.completedAt && { completedAt: new Date() }),
    };

    projectsStore[idx] = updated;
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    projectsStore = projectsStore.filter(p => p.id !== id);
  }
}
