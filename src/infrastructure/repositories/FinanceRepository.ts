/**
 * Infrastructure: FinanceRepository
 * In-memory mock with realistic seeded transactions for 2026.
 */

import { IFinanceRepository } from '@/src/domain/repositories/IFinanceRepository';
import {
  Transaction, CreateTransactionDTO,
  TransactionType, TransactionCategory, PaymentMethod,
  DailyReport, DailyReportResult, DailyReportPagination,
  BalanceSheet, IncomeStatement, CashFlow,
} from '@/src/domain/entities/Finance';

// ─── Seed ─────────────────────────────────────────────────────────────────────

let txStore: Transaction[] = [
  // Januari 2026
  { id: 'TRX-001', date: new Date('2026-01-05'), type: 'Pemasukan',  category: 'Pendapatan Jasa',   description: 'Pembayaran Jasa Instalasi LAN – PRJ-005',       amount: 6_100_000, paymentMethod: 'Transfer Bank', referenceNo: 'INV-2601-001', projectId: 'PRJ-005', createdBy: 'Alex Rivera' },
  { id: 'TRX-002', date: new Date('2026-01-10'), type: 'Pengeluaran', category: 'Pembelian Barang', description: 'Beli kabel UTP Cat6 & switch',                   amount: 4_600_000, paymentMethod: 'Transfer Bank', referenceNo: 'PO-2601-001',  createdBy: 'Sarah Chen'  },
  { id: 'TRX-003', date: new Date('2026-01-15'), type: 'Pemasukan',  category: 'Pendapatan Barang', description: 'Pembayaran Pengadaan ATK – PRJ-002',             amount: 4_950_000, paymentMethod: 'Transfer Bank', referenceNo: 'INV-2601-002', projectId: 'PRJ-002', createdBy: 'Sarah Chen'  },
  { id: 'TRX-004', date: new Date('2026-01-20'), type: 'Pengeluaran', category: 'Gaji & Upah',      description: 'Gaji karyawan Januari 2026',                    amount: 18_000_000,paymentMethod: 'Transfer Bank', referenceNo: 'PAY-2601-001', createdBy: 'Alex Rivera' },
  { id: 'TRX-005', date: new Date('2026-01-25'), type: 'Pengeluaran', category: 'Utilitas',          description: 'Listrik & Internet kantor Januari',             amount: 1_200_000, paymentMethod: 'Transfer Bank', createdBy: 'Alex Rivera' },
  { id: 'TRX-006', date: new Date('2026-01-28'), type: 'Pengeluaran', category: 'Pembelian Barang', description: 'Beli kertas HVS, tinta & ballpoint – PRJ-002',   amount: 4_950_000, paymentMethod: 'Tunai',         projectId: 'PRJ-002', createdBy: 'Sarah Chen'  },

  // Februari 2026
  { id: 'TRX-007', date: new Date('2026-02-03'), type: 'Pemasukan',  category: 'Pendapatan Barang', description: 'DP 50% Pengadaan Komputer – PRJ-001',           amount: 93_000_000,paymentMethod: 'Transfer Bank', referenceNo: 'INV-2602-001', projectId: 'PRJ-001', createdBy: 'Alex Rivera' },
  { id: 'TRX-008', date: new Date('2026-02-05'), type: 'Pengeluaran', category: 'Pembelian Barang', description: 'Beli 20 unit PC Desktop Core i5',                amount: 150_000_000,paymentMethod:'Transfer Bank', referenceNo: 'PO-2602-001',  projectId: 'PRJ-001', createdBy: 'Alex Rivera' },
  { id: 'TRX-009', date: new Date('2026-02-08'), type: 'Pengeluaran', category: 'Pembelian Barang', description: 'Beli 20 unit Monitor 24"',                      amount: 36_000_000,paymentMethod: 'Transfer Bank', referenceNo: 'PO-2602-002',  projectId: 'PRJ-001', createdBy: 'Alex Rivera' },
  { id: 'TRX-010', date: new Date('2026-02-10'), type: 'Pemasukan',  category: 'Pendapatan Jasa',   description: 'Pelunasan Jasa Website – PRJ-008',              amount: 8_500_000, paymentMethod: 'QRIS',          referenceNo: 'INV-2602-002', projectId: 'PRJ-008', createdBy: 'Tom Brown'   },
  { id: 'TRX-011', date: new Date('2026-02-15'), type: 'Pengeluaran', category: 'Biaya Operasional', description: 'Sewa kantor Februari 2026',                     amount: 5_000_000, paymentMethod: 'Transfer Bank', referenceNo: 'RENT-2602',   createdBy: 'Alex Rivera' },
  { id: 'TRX-012', date: new Date('2026-02-20'), type: 'Pengeluaran', category: 'Gaji & Upah',      description: 'Gaji karyawan Februari 2026',                   amount: 18_000_000,paymentMethod: 'Transfer Bank', referenceNo: 'PAY-2602-001', createdBy: 'Alex Rivera' },
  { id: 'TRX-013', date: new Date('2026-02-22'), type: 'Pemasukan',  category: 'Pendapatan Jasa',   description: 'Pembayaran Servis Laptop – PRJ-003',            amount: 3_450_000, paymentMethod: 'Tunai',          referenceNo: 'INV-2602-003', projectId: 'PRJ-003', createdBy: 'James Wilson' },
  { id: 'TRX-014', date: new Date('2026-02-25'), type: 'Pengeluaran', category: 'Pajak',             description: 'PPh 21 Februari 2026',                         amount: 2_700_000, paymentMethod: 'Transfer Bank', referenceNo: 'TAX-2602-001', createdBy: 'Alex Rivera' },
  { id: 'TRX-015', date: new Date('2026-02-28'), type: 'Pengeluaran', category: 'Utilitas',          description: 'Listrik & Internet kantor Februari',            amount: 1_250_000, paymentMethod: 'Transfer Bank', createdBy: 'Alex Rivera' },

  // Maret 2026 (berjalan)
  { id: 'TRX-016', date: new Date('2026-03-01'), type: 'Pemasukan',  category: 'Pendapatan Barang', description: 'Pelunasan 50% Pengadaan Komputer – PRJ-001',    amount: 93_000_000,paymentMethod: 'Transfer Bank', referenceNo: 'INV-2603-001', projectId: 'PRJ-001', createdBy: 'Alex Rivera' },
  { id: 'TRX-017', date: new Date('2026-03-01'), type: 'Pengeluaran', category: 'Biaya Operasional', description: 'Sewa kantor Maret 2026',                        amount: 5_000_000, paymentMethod: 'Transfer Bank', referenceNo: 'RENT-2603',   createdBy: 'Alex Rivera' },
];

let nextTxId = txStore.length + 1;

/**
 * Shared mutable refs — used by ProjectRepository to auto-create a
 * Pemasukan transaction when a project status changes to 'Dibayar'.
 */
export const txStoreRef   = { get value() { return txStore; },   set value(v: Transaction[]) { txStore   = v; } };
export const nextTxIdRef  = { get value() { return nextTxId; },  set value(v: number)        { nextTxId  = v; } };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupByDate(txs: Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();
  txs.forEach(tx => {
    const key = new Date(tx.date).toISOString().split('T')[0];
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  });
  return map;
}

function buildDailyReports(txs: Transaction[], saldoAwal: number): DailyReport[] {
  const byDate = groupByDate(txs);
  const dates  = Array.from(byDate.keys()).sort();
  let running  = saldoAwal;

  return dates.map(dateKey => {
    const dayTxs   = byDate.get(dateKey)!;
    const masuk    = dayTxs.filter(t => t.type === 'Pemasukan').reduce((s, t) => s + t.amount, 0);
    const keluar   = dayTxs.filter(t => t.type === 'Pengeluaran').reduce((s, t) => s + t.amount, 0);
    const saldoDay = masuk - keluar;
    const prev     = running;
    running       += saldoDay;
    return {
      date:             new Date(dateKey),
      transactions:     dayTxs,
      totalPemasukan:   masuk,
      totalPengeluaran: keluar,
      saldo:            saldoDay,
      saldoAwal:        prev,
      saldoAkhir:       running,
    };
  });
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class FinanceRepository implements IFinanceRepository {

  async getTransactions(dateFrom?: Date, dateTo?: Date): Promise<Transaction[]> {
    let list = [...txStore];
    if (dateFrom) list = list.filter(t => new Date(t.date) >= new Date(dateFrom));
    if (dateTo)   list = list.filter(t => new Date(t.date) <= new Date(dateTo));
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
    const tx: Transaction = {
      id:            `TRX-${String(nextTxId++).padStart(3, '0')}`,
      date:          new Date(dto.date),
      type:          dto.type          as TransactionType,
      category:      dto.category      as TransactionCategory,
      description:   dto.description,
      amount:        dto.amount,
      paymentMethod: dto.paymentMethod as PaymentMethod,
      referenceNo:   dto.referenceNo,
      projectId:     dto.projectId,
      createdBy:     dto.createdBy,
    };
    txStore.unshift(tx);
    return tx;
  }

  async deleteTransaction(id: string): Promise<void> {
    txStore = txStore.filter(t => t.id !== id);
  }

  async getDailyReport(
    dateFrom: Date, dateTo: Date, page: number, perPage: number
  ): Promise<DailyReportResult> {
    const filtered = txStore.filter(t => {
      const d = new Date(t.date);
      return d >= new Date(dateFrom) && d <= new Date(dateTo);
    });

    // all transactions before dateFrom → compute opening saldo
    const prevTxs   = txStore.filter(t => new Date(t.date) < new Date(dateFrom));
    const saldoAwal = prevTxs.reduce((s, t) => t.type === 'Pemasukan' ? s + t.amount : s - t.amount, 50_000_000);

    const reports   = buildDailyReports(filtered, saldoAwal);
    const total     = reports.length;
    const totalPages= Math.max(1, Math.ceil(total / perPage));
    const safePage  = Math.min(Math.max(1, page), totalPages);
    const paged     = reports.slice((safePage - 1) * perPage, safePage * perPage);

    const totalPemasukan   = filtered.filter(t => t.type === 'Pemasukan').reduce((s, t) => s + t.amount, 0);
    const totalPengeluaran = filtered.filter(t => t.type === 'Pengeluaran').reduce((s, t) => s + t.amount, 0);

    const pagination: DailyReportPagination = {
      currentPage: safePage, totalPages, totalRecords: total, perPage
    };

    return {
      reports: paged,
      pagination,
      totalPemasukan,
      totalPengeluaran,
      netCashFlow: totalPemasukan - totalPengeluaran,
    };
  }

  async getBalanceSheet(period: string): Promise<BalanceSheet> {
    void period;
    return {
      period: 'Februari 2026',
      assets: [
        {
          title: 'Aktiva Lancar',
          items: [
            { name: 'Kas & Bank',            amount: 89_550_000 },
            { name: 'Piutang Usaha',          amount: 50_000_000 },
            { name: 'Persediaan Barang',      amount: 25_000_000 },
            { name: 'Biaya Dibayar Dimuka',   amount: 5_000_000  },
          ],
          total: 169_550_000,
        },
        {
          title: 'Aktiva Tetap',
          items: [
            { name: 'Peralatan Kantor',       amount: 35_000_000 },
            { name: 'Kendaraan',              amount: 80_000_000 },
            { name: 'Akumulasi Penyusutan',   amount: -15_000_000 },
          ],
          total: 100_000_000,
        },
      ],
      liabilities: [
        {
          title: 'Kewajiban Jangka Pendek',
          items: [
            { name: 'Utang Usaha',            amount: 30_000_000 },
            { name: 'Utang Pajak',            amount: 5_400_000  },
            { name: 'Biaya Masih Harus Dibayar', amount: 3_000_000 },
          ],
          total: 38_400_000,
        },
        {
          title: 'Kewajiban Jangka Panjang',
          items: [
            { name: 'Utang Bank',             amount: 81_150_000 },
          ],
          total: 81_150_000,
        },
      ],
      equity: [
        {
          title: 'Ekuitas',
          items: [
            { name: 'Modal Disetor',          amount: 100_000_000 },
            { name: 'Saldo Laba Ditahan',     amount: 40_000_000  },
            { name: 'Laba Tahun Berjalan',    amount: 10_000_000  },
          ],
          total: 150_000_000,
        },
      ],
      totalAssets:      269_550_000,
      totalLiabilities: 119_550_000,
      totalEquity:      150_000_000,
    };
  }

  async getIncomeStatement(period: string): Promise<IncomeStatement> {
    void period;
    return {
      period: 'Februari 2026',
      revenue: [
        { name: 'Pendapatan Jasa',           amount: 11_950_000 },
        { name: 'Pendapatan Penjualan Barang', amount: 93_000_000 },
        { name: 'Pendapatan Lainnya',         amount: 500_000    },
      ],
      cogs: [
        { name: 'HPP Barang',                amount: 186_000_000 },
        { name: 'Biaya Langsung Jasa',       amount: 2_500_000  },
      ],
      grossProfit: -83_050_000,
      opex: [
        { name: 'Gaji & Upah',              amount: 18_000_000 },
        { name: 'Sewa Kantor',              amount: 5_000_000  },
        { name: 'Utilitas',                 amount: 1_250_000  },
        { name: 'Biaya Operasional Lain',   amount: 800_000    },
      ],
      operatingProfit: -108_100_000,
      otherIncome: [
        { name: 'Pendapatan Bunga',         amount: 150_000 },
      ],
      otherExpense: [
        { name: 'Beban Bunga',              amount: 500_000 },
        { name: 'PPh 21',                   amount: 2_700_000 },
      ],
      ebt:       -111_150_000,
      tax:        0,
      netIncome: -111_150_000,
    };
  }

  async getCashFlow(period: string): Promise<CashFlow> {
    void period;
    return {
      period: 'Februari 2026',
      operating: {
        title: 'Aktivitas Operasi',
        lines: [
          { name: 'Penerimaan dari Pelanggan',    amount:  105_450_000 },
          { name: 'Pembayaran kepada Pemasok',    amount: -186_000_000 },
          { name: 'Pembayaran Gaji',              amount:  -18_000_000 },
          { name: 'Pembayaran Pajak',             amount:   -2_700_000 },
          { name: 'Pembayaran Beban Operasional', amount:   -6_250_000 },
        ],
        total: -107_500_000,
      },
      investing: {
        title: 'Aktivitas Investasi',
        lines: [
          { name: 'Pembelian Peralatan Kantor',   amount: 0 },
        ],
        total: 0,
      },
      financing: {
        title: 'Aktivitas Pendanaan',
        lines: [
          { name: 'Penerimaan Pinjaman Bank',     amount:  100_000_000 },
          { name: 'Pembayaran Cicilan Pinjaman',  amount:   -5_000_000 },
        ],
        total: 95_000_000,
      },
      netCashChange:  -12_500_000,
      beginningCash:  102_050_000,
      endingCash:      89_550_000,
    };
  }
}
