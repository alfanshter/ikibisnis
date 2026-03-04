/**
 * Domain Entity: Quotation (Penawaran)
 *
 * Alur status:
 *
 *   Draft ──► Terkirim ──► ACC ──► (konversi ke Project)
 *                │                        │
 *                └──► Ditolak             └──► poNumber diinput (opsional)
 *
 * Project bisa dibuat dengan dua cara:
 *   1. Konversi dari Quotation yang sudah ACC  (origin = 'quotation')
 *   2. Dibuat langsung tanpa penawaran         (origin = 'direct')
 *
 * PO (Purchase Order) bersifat opsional — tidak semua project menggunakan PO.
 */

// ─── Enums / Literal Types ──────────────────────────────────────────────────

/**
 * Status life-cycle penawaran.
 *
 * Draft     → Penawaran sedang dibuat / belum dikirim ke klien
 * Terkirim  → Sudah dikirim, menunggu respons klien
 * ACC       → Disetujui klien (Accepted / ACC)
 * Ditolak   → Ditolak klien
 * Dikonversi→ Sudah diubah menjadi Project (terminal state)
 */
export type QuotationStatus =
  | 'Draft'
  | 'Terkirim'
  | 'ACC'
  | 'Ditolak'
  | 'Dikonversi';

/**
 * Transisi status yang diizinkan.
 * Digunakan untuk validasi di use-case sebelum update.
 */
export const ALLOWED_TRANSITIONS: Record<QuotationStatus, QuotationStatus[]> = {
  Draft:       ['Terkirim', 'Ditolak'],
  Terkirim:    ['ACC', 'Ditolak'],
  ACC:         ['Dikonversi'],
  Ditolak:     [],          // terminal
  Dikonversi:  [],          // terminal
};

/** Origin pembuatan project (dari penawaran atau langsung). */
export type ProjectOrigin = 'quotation' | 'direct';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface QuotationClient {
  name: string;
  contact: string;       // nomor HP / email
  institution?: string;
}

/** Satu baris item pada penawaran (sama strukturnya dengan ProjectItem). */
export interface QuotationItem {
  name: string;
  quantity: number;
  unit: string;          // pcs, unit, rim, dll.
  unitPrice: number;     // harga satuan (IDR)
}

export interface Quotation {
  id: string;            // QUO-001, QUO-002, ...
  title: string;         // Judul penawaran
  description: string;
  category: string;      // sama dengan ProjectCategory
  priority: string;      // Rendah | Sedang | Tinggi
  client: QuotationClient;
  items: QuotationItem[];
  totalValue: number;    // auto-sum dari items
  assignedTo: string;    // user yang bertanggung jawab
  status: QuotationStatus;
  validUntil: Date;      // tanggal berlakunya penawaran
  createdAt: Date;
  sentAt?: Date;         // kapan dikirim ke klien
  accAt?: Date;          // kapan di-ACC klien
  rejectedAt?: Date;
  rejectionReason?: string;
  convertedAt?: Date;    // kapan dikonversi ke project
  convertedProjectId?: string; // ID project hasil konversi

  /**
   * Nomor PO dari klien — opsional.
   * Diisi saat ACC jika klien menerbitkan PO.
   */
  poNumber?: string;

  notes?: string;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateQuotationDTO {
  title: string;
  description: string;
  category: string;
  priority: string;
  client: QuotationClient;
  items: QuotationItem[];
  assignedTo: string;
  validUntil: Date;
  notes?: string;
}

export interface UpdateQuotationDTO {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  client?: QuotationClient;
  items?: QuotationItem[];
  assignedTo?: string;
  validUntil?: Date;
  notes?: string;
}

/**
 * DTO untuk ACC penawaran — poNumber opsional.
 */
export interface AccQuotationDTO {
  id: string;
  poNumber?: string;    // kosong = tanpa PO
}

/**
 * DTO untuk menolak penawaran.
 */
export interface RejectQuotationDTO {
  id: string;
  reason?: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface QuotationPagination {
  currentPage: number;
  totalPages: number;
  totalQuotations: number;
  perPage: number;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface QuotationStats {
  total: number;
  draft: number;
  terkirim: number;
  acc: number;
  ditolak: number;
  dikonversi: number;
  totalValueACC: number;    // total nilai yang sudah ACC
  totalValuePending: number; // total nilai yang masih pending (Draft + Terkirim)
}

// ─── Collection ──────────────────────────────────────────────────────────────

export class QuotationCollection {
  constructor(
    public readonly quotations: Quotation[],
    public readonly pagination: QuotationPagination
  ) {}

  getByStatus(status: QuotationStatus): Quotation[] {
    return this.quotations.filter(q => q.status === status);
  }

  getTotalValue(): number {
    return this.quotations.reduce((sum, q) => sum + q.totalValue, 0);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const calcQuotationTotal = (items: QuotationItem[]): number =>
  items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

/**
 * Validasi apakah transisi status diizinkan.
 */
export const canTransition = (from: QuotationStatus, to: QuotationStatus): boolean =>
  ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
