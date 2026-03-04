/**
 * Domain Entity: Project Management
 * Covers all incoming job/procurement orders (pengadaan barang, jasa, ATK, komputer, dll.)
 * Pure business logic — no framework dependencies.
 */

// ─── Enums / Literal Types ──────────────────────────────────────────────────

/**
 * Asal muasal pembuatan project:
 *   'direct'    → Dibuat langsung tanpa melalui proses penawaran
 *   'quotation' → Hasil konversi dari Penawaran (Quotation) yang di-ACC
 */
export type ProjectOrigin = 'direct' | 'quotation';

export type ProjectCategory =
  | 'Pengadaan Barang'
  | 'Pengadaan Jasa'
  | 'Pengadaan ATK'
  | 'Pengadaan Komputer'
  | 'Pengadaan Furniture'
  | 'Lainnya';

export type ProjectStatus =
  | 'Baru'          // Newly received, not yet started
  | 'Proses'        // In progress
  | 'Selesai'       // Done
  | 'Dibatalkan';   // Cancelled

export type ProjectPriority = 'Rendah' | 'Sedang' | 'Tinggi';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface ProjectClient {
  name: string;
  contact: string;   // phone / email
  institution?: string;
}

export interface ProjectItem {
  name: string;
  quantity: number;
  unit: string;        // unit satuan: pcs, unit, rim, dll.
  unitPrice: number;   // harga satuan (IDR)
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: ProjectPriority;
  client: ProjectClient;
  items: ProjectItem[];
  totalValue: number;   // auto-summed from items
  assignedTo: string;   // user name
  createdAt: Date;
  deadline: Date;
  completedAt?: Date;
  notes?: string;

  /** Asal pembuatan project: langsung atau dari penawaran yang di-ACC. */
  origin: ProjectOrigin;

  /**
   * ID Penawaran (Quotation) sumber, jika origin = 'quotation'.
   * Null jika origin = 'direct'.
   */
  quotationId?: string;

  /**
   * Nomor PO dari klien — opsional.
   * Bisa diisi saat konversi dari quotation, atau ditambahkan belakangan.
   */
  poNumber?: string;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateProjectDTO {
  title: string;
  description: string;
  category: ProjectCategory;
  priority: ProjectPriority;
  client: ProjectClient;
  items: ProjectItem[];
  assignedTo: string;
  deadline: Date;
  notes?: string;
  /** Default: 'direct'. Set 'quotation' jika dibuat dari konversi penawaran. */
  origin?: ProjectOrigin;
  /** Wajib jika origin = 'quotation'. */
  quotationId?: string;
  /** Opsional — bisa dikosongkan jika tidak ada PO. */
  poNumber?: string;
}

export interface UpdateProjectDTO {
  id: string;
  title?: string;
  description?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  client?: ProjectClient;
  items?: ProjectItem[];
  assignedTo?: string;
  deadline?: Date;
  notes?: string;
  /** Update nomor PO kapan saja setelah project dibuat. */
  poNumber?: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface ProjectPagination {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  perPage: number;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface ProjectStats {
  total: number;
  baru: number;
  proses: number;
  selesai: number;
  dibatalkan: number;
  totalValue: number;
}

// ─── Collection ──────────────────────────────────────────────────────────────

export class ProjectCollection {
  constructor(
    public readonly projects: Project[],
    public readonly pagination: ProjectPagination
  ) {}

  getByStatus(status: ProjectStatus): Project[] {
    return this.projects.filter(p => p.status === status);
  }

  getByCategory(category: ProjectCategory): Project[] {
    return this.projects.filter(p => p.category === category);
  }

  getTotalValue(): number {
    return this.projects.reduce((sum, p) => sum + p.totalValue, 0);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const calcProjectTotal = (items: ProjectItem[]): number =>
  items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
