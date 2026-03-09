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
  | 'Pending'       // Waiting for approval / confirmation from client
  | 'Proses'        // In progress
  | 'Selesai'       // Work done, awaiting payment
  | 'Dibayar'       // Payment received → auto-creates finance transaction
  | 'Dibatalkan';   // Cancelled

export type ProjectPriority = 'Rendah' | 'Sedang' | 'Tinggi';

/**
 * Billing / contract type:
 *   'Reguler'     → One-off project, single full payment when done (default)
 *   'Sewa'        → Annual/periodic subscription (e.g. website maintenance, hosting)
 *   'Termin'      → Installment payments (e.g. PLTS installation with DP + progress billings)
 */
export type ProjectBillingType = 'Reguler' | 'Sewa' | 'Termin';

export type PaymentMethod = 'Tunai' | 'Transfer Bank' | 'QRIS' | 'Cek/Giro';

// ─── Termin (Installment) ────────────────────────────────────────────────────

export type TerminStatus = 'Belum Dibayar' | 'Jatuh Tempo' | 'Lunas';

/**
 * A single installment within a Termin project.
 * e.g. DP 30%, Progress 40%, Pelunasan 30%.
 */
export interface Termin {
  id:             string;         // e.g. 'TRM-001-1'
  label:          string;         // e.g. 'DP (30%)', 'Termin 2', 'Pelunasan'
  percentage?:    number;         // e.g. 30 → 30% of totalValue (optional, informational)
  amount:         number;         // IDR amount for this termin
  dueDate:        Date;           // expected payment date
  status:         TerminStatus;
  paidAt?:        Date;
  paymentMethod?: PaymentMethod;
  notes?:         string;
}

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

/** Tarif PPN yang didukung (opsional). */
export type PPNRate = 11 | 12;

// ─── External Marketer ───────────────────────────────────────────────────────

/**
 * Marketing eksternal — orang/pihak di luar perusahaan yang membantu
 * mendapatkan proyek ini. Fee bisa berupa persentase dari totalValue
 * atau nominal tetap (flat).
 */
export type MarketerFeeType = 'percent' | 'flat';

export interface ExternalMarketer {
  name:    string;             // nama marketer / referrer
  contact?: string;            // nomor HP / email (opsional)
  feeType: MarketerFeeType;    // 'percent' → % dari totalValue | 'flat' → nominal langsung
  feePercent?: number;         // diisi jika feeType = 'percent' (misal: 5 → 5%)
  feeAmount?:  number;         // diisi jika feeType = 'flat' (nominal IDR)
  notes?:      string;         // catatan tambahan (opsional)
}

/** Biaya-biaya tambahan opsional per proyek. */
export interface ProjectAdditionalFees {
  /** PPN — opsional. Nilai 11 atau 12 (persen). */
  ppnRate?: PPNRate;         // jika undefined → tidak dikenakan PPN

  /** PPH — opsional. */
  pphEnabled?: boolean;     // true → PPH dikenakan
  pphRate?: number;         // persen, default 0.5 jika tidak diisi

  /** E-Materai (Rp 10.000 standar, bisa di-override). */
  eMateraiEnabled?: boolean;
  eMateraiAmount?: number;  // default 10_000

  /** Materai fisik (Rp 10.000 standar). */
  materaiEnabled?: boolean;
  materaiAmount?: number;   // default 10_000

  /** Biaya E-Sign (opsional, nominal bebas). */
  eSignEnabled?: boolean;
  eSignAmount?: number;

  /**
   * Biaya Admin Platform (opsional, nominal bebas).
   * Contoh: Siplah, InaProc, LKPP, dll.
   */
  adminFeeEnabled?: boolean;
  adminFeeAmount?: number;
  adminFeePlatform?: string; // nama platform, misal 'Siplah', 'InaProc'
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
  totalValue: number;   // auto-summed from items (before taxes/fees)

  /**
   * Biaya tambahan opsional: PPN, PPH, e-materai, materai, e-sign.
   * Jika tidak ada, field ini undefined.
   */
  additionalFees?: ProjectAdditionalFees;

  /**
   * Grand total setelah memperhitungkan semua biaya tambahan.
   * Jika tidak ada additionalFees → sama dengan totalValue.
   */
  grandTotal: number;

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

  /**
   * Tipe penagihan / kontrak proyek.
   * Default: 'Reguler' (lunas sekaligus).
   */
  billingType: ProjectBillingType;

  /**
   * Termin / cicilan — diisi jika billingType === 'Termin'.
   * Setiap termin yang dibayar akan otomatis membuat transaksi keuangan.
   */
  termins?: Termin[];

  /**
   * Periode sewa — diisi jika billingType === 'Sewa'.
   */
  sewaStartDate?:    Date;    // tanggal mulai sewa
  sewaEndDate?:      Date;    // tanggal jatuh tempo / berakhir
  renewalMonths?:    number;  // periode perpanjangan (bulan), default 12

  /**
   * Diisi ketika status berubah ke 'Dibayar' (hanya untuk billingType 'Reguler'/'Sewa').
   * Untuk Termin, pencatatan keuangan dilakukan per termin.
   */
  paidAt?:          Date;
  paymentMethod?:   PaymentMethod;
  paymentNotes?:    string;

  /**
   * Marketing eksternal — pihak di luar perusahaan yang membantu mendapatkan proyek ini.
   * Fee-nya dicatat sebagai informasi, tidak mempengaruhi totalValue/grandTotal.
   */
  externalMarketer?: ExternalMarketer;
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
  /** UUID of the user this project is assigned to (used when sending to backend). */
  assignedToUserId?: string;
  deadline: Date;
  notes?: string;
  /** Default: 'direct'. Set 'quotation' jika dibuat dari konversi penawaran. */
  origin?: ProjectOrigin;
  /** Wajib jika origin = 'quotation'. */
  quotationId?: string;
  /** Opsional — bisa dikosongkan jika tidak ada PO. */
  poNumber?: string;
  /** Default: 'Reguler'. */
  billingType?: ProjectBillingType;
  /** Diisi jika billingType = 'Termin'. */
  termins?: Omit<Termin, 'id' | 'status' | 'paidAt' | 'paymentMethod'>[];
  /** Diisi jika billingType = 'Sewa'. */
  sewaStartDate?:  Date;
  sewaEndDate?:    Date;
  renewalMonths?:  number;
  /** Biaya tambahan opsional: PPN, PPH, e-materai, materai, e-sign. */
  additionalFees?: ProjectAdditionalFees;
  /** Marketing eksternal yang mendatangkan proyek ini. */
  externalMarketer?: ExternalMarketer;
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
  /** Wajib diisi saat mengubah status ke 'Dibayar' (Reguler/Sewa). */
  paymentMethod?: PaymentMethod;
  paymentNotes?:  string;
  /** Update info sewa */
  sewaStartDate?: Date;
  sewaEndDate?:   Date;
  renewalMonths?: number;
  /** Biaya tambahan opsional: PPN, PPH, e-materai, materai, e-sign. */
  additionalFees?: ProjectAdditionalFees;
  /** Marketing eksternal yang mendatangkan proyek ini. */
  externalMarketer?: ExternalMarketer;
}

/** DTO untuk membayar satu termin dalam proyek bertipe 'Termin'. */
export interface PayTerminDTO {
  projectId:     string;
  terminId:      string;
  paymentMethod: PaymentMethod;
  notes?:        string;
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
  pending: number;
  proses: number;
  selesai: number;
  dibayar: number;
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

/**
 * Hitung grand total = subtotal + PPN + PPH.
 * E-Materai, Materai, E-Sign, dan Biaya Admin TIDAK termasuk grand total —
 * mereka adalah biaya operasional internal yang dicatat terpisah.
 */
export const calcGrandTotal = (subtotal: number, fees?: ProjectAdditionalFees): number => {
  if (!fees) return subtotal;
  const ppn     = fees.ppnRate    ? (subtotal * fees.ppnRate) / 100           : 0;
  const pphRate = fees.pphEnabled ? (fees.pphRate ?? 0.5)                     : 0;
  const pph     = pphRate > 0     ? (subtotal * pphRate) / 100                : 0;
  return subtotal + ppn + pph;
};

/**
 * Hitung total biaya operasional yang TIDAK masuk grand total:
 * E-Materai, Materai, E-Sign, Biaya Admin Platform.
 * Digunakan hanya untuk informasi / catatan internal.
 */
export const calcOperationalCosts = (fees?: ProjectAdditionalFees): number => {
  if (!fees) return 0;
  const eMaterai = fees.eMateraiEnabled ? (fees.eMateraiAmount ?? 10_000) : 0;
  const materai  = fees.materaiEnabled  ? (fees.materaiAmount  ?? 10_000) : 0;
  const eSign    = fees.eSignEnabled    ? (fees.eSignAmount    ?? 0)      : 0;
  const adminFee = fees.adminFeeEnabled ? (fees.adminFeeAmount ?? 0)      : 0;
  return eMaterai + materai + eSign + adminFee;
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

/**
 * Hitung fee marketer berdasarkan feeType:
 *  - 'percent' → feePercent% dari totalValue
 *  - 'flat'    → feeAmount langsung
 */
export const calcMarketerFee = (totalValue: number, marketer?: ExternalMarketer): number => {
  if (!marketer) return 0;
  if (marketer.feeType === 'percent') return (totalValue * (marketer.feePercent ?? 0)) / 100;
  return marketer.feeAmount ?? 0;
};
