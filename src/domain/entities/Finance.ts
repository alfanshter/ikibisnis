/**
 * Domain Entity: Finance
 * Covers Laporan Harian, Neraca, Laba Rugi, Arus Kas.
 * Pure business logic — no framework dependencies.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type TransactionType = 'Pemasukan' | 'Pengeluaran';

export type TransactionCategory =
  // Pemasukan
  | 'Pendapatan Jasa'
  | 'Pendapatan Barang'
  | 'Pendapatan Lainnya'
  // Pengeluaran
  | 'Pembelian Barang'
  | 'Biaya Operasional'
  | 'Gaji & Upah'
  | 'Pajak'
  | 'Utilitas'
  | 'Pengeluaran Lainnya';

export type PaymentMethod = 'Tunai' | 'Transfer Bank' | 'QRIS' | 'Cek/Giro';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  date: Date;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;      // IDR
  paymentMethod: PaymentMethod;
  referenceNo?: string;
  projectId?: string;  // linked to a project if applicable
  createdBy: string;
}

export interface CreateTransactionDTO {
  date: Date;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNo?: string;
  projectId?: string;
  createdBy: string;
}

// ─── Daily Report ─────────────────────────────────────────────────────────────

export interface DailyReport {
  date: Date;
  transactions: Transaction[];
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;           // pemasukan - pengeluaran
  saldoAwal: number;       // balance at start of day
  saldoAkhir: number;      // saldoAwal + saldo
}

export interface DailyReportPagination {
  currentPage:    number;
  totalPages:     number;
  totalRecords:   number;
  perPage:        number;
}

export interface DailyReportResult {
  reports:    DailyReport[];
  pagination: DailyReportPagination;
  // range summary
  totalPemasukan:  number;
  totalPengeluaran: number;
  netCashFlow:     number;
}

// ─── Balance Sheet (Neraca) ───────────────────────────────────────────────────

export interface BalanceSheetItem {
  name: string;
  amount: number;
  isSubtotal?: boolean;
}

export interface BalanceSheetSection {
  title:    string;
  items:    BalanceSheetItem[];
  total:    number;
}

export interface BalanceSheet {
  period: string;       // e.g. "Februari 2026"
  assets: BalanceSheetSection[];          // Aktiva
  liabilities: BalanceSheetSection[];     // Kewajiban
  equity: BalanceSheetSection[];          // Ekuitas
  totalAssets:      number;
  totalLiabilities: number;
  totalEquity:      number;
}

// ─── Income Statement (Laba Rugi) ────────────────────────────────────────────

export interface IncomeStatementLine {
  name:   string;
  amount: number;
  isSubtotal?: boolean;
  isTotal?:    boolean;
}

export interface IncomeStatement {
  period:      string;
  revenue:     IncomeStatementLine[];   // Pendapatan
  cogs:        IncomeStatementLine[];   // HPP
  grossProfit: number;
  opex:        IncomeStatementLine[];   // Biaya Operasional
  operatingProfit: number;
  otherIncome:     IncomeStatementLine[];
  otherExpense:    IncomeStatementLine[];
  ebt:         number;  // Laba sebelum pajak
  tax:         number;
  netIncome:   number;  // Laba bersih
}

// ─── Cash Flow (Arus Kas) ─────────────────────────────────────────────────────

export interface CashFlowLine {
  name:    string;
  amount:  number;     // positive = cash in, negative = cash out
  isTotal?: boolean;
}

export interface CashFlowSection {
  title: string;
  lines: CashFlowLine[];
  total: number;
}

export interface CashFlow {
  period:             string;
  operating:          CashFlowSection;   // Aktivitas Operasi
  investing:          CashFlowSection;   // Aktivitas Investasi
  financing:          CashFlowSection;   // Aktivitas Pendanaan
  netCashChange:      number;
  beginningCash:      number;
  endingCash:         number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const formatCurrencyIdr = (amount: number, showSign = false): string => {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(Math.abs(amount));
  if (showSign && amount > 0)  return `+${formatted}`;
  if (showSign && amount < 0)  return `-${formatted}`;
  return formatted;
};

export const formatDate = (d: Date): string =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDateShort = (d: Date): string =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Hutang & Piutang ─────────────────────────────────────────────────────────

/** hutang = kita yang berhutang (kewajiban bayar), piutang = orang lain berhutang ke kita */
export type DebtType   = 'hutang' | 'piutang';
export type DebtStatus = 'belum_lunas' | 'sebagian' | 'lunas';

export interface Debt {
  id:            string;
  type:          DebtType;
  counterparty:  string;      // nama orang / perusahaan
  description:   string;
  amount:        number;      // jumlah awal
  paidAmount:    number;      // sudah dibayar
  remainingAmount: number;    // sisa = amount - paidAmount
  status:        DebtStatus;
  dueDate:       string | null;   // ISO date string
  createdAt:     string;
  updatedAt:     string;
  projectId?:    string;
  notes?:        string;
}

export interface CreateDebtDTO {
  type:          DebtType;
  counterparty:  string;
  description:   string;
  amount:        number;
  dueDate?:      string;
  projectId?:    string;
  notes?:        string;
}

export interface UpdateDebtDTO {
  counterparty?: string;
  description?:  string;
  amount?:       number;
  dueDate?:      string;
  notes?:        string;
}

export interface PayDebtDTO {
  payAmount: number;
  notes?:    string;
}

export interface DebtCollection {
  data:       Debt[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface DebtSummary {
  totalHutang:          number;   // total belum lunas (kita berhutang)
  totalPiutang:         number;   // total belum lunas (orang berhutang ke kita)
  hutangJatuhTempo:     number;   // hutang yang sudah lewat dueDate
  piutangJatuhTempo:    number;
  countHutang:          number;
  countPiutang:         number;
}

export interface GetDebtsQuery {
  page?:   number;
  limit?:  number;
  type?:   DebtType;
  status?: DebtStatus;
  search?: string;
}
