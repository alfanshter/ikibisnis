/**
 * Infrastructure: DebtRepository (DUMMY / In-Memory)
 * Uses hardcoded seed data. Swap this class with the real API version
 * once the backend endpoint is ready.
 */

import { IDebtRepository } from '@/src/domain/repositories/IDebtRepository';
import {
  Debt,
  DebtCollection,
  DebtSummary,
  CreateDebtDTO,
  UpdateDebtDTO,
  PayDebtDTO,
  GetDebtsQuery,
} from '@/src/domain/entities/Finance';

// ── Seed data ─────────────────────────────────────────────────────────────────

let DUMMY_DEBTS: Debt[] = [
  {
    id:              'd-001',
    type:            'hutang',
    counterparty:    'PT Sumber Makmur',
    description:     'Pembelian bahan baku aluminium',
    amount:          15_000_000,
    paidAmount:      5_000_000,
    remainingAmount: 10_000_000,
    status:          'sebagian',
    dueDate:         '2026-03-31',
    createdAt:       '2026-01-10T08:00:00.000Z',
    updatedAt:       '2026-02-15T10:30:00.000Z',
    notes:           'Termin 2 kali bayar',
  },
  {
    id:              'd-002',
    type:            'hutang',
    counterparty:    'CV Teknik Jaya',
    description:     'Jasa pemasangan rangka baja',
    amount:          8_500_000,
    paidAmount:      0,
    remainingAmount: 8_500_000,
    status:          'belum_lunas',
    dueDate:         '2026-02-28',
    createdAt:       '2026-01-20T09:00:00.000Z',
    updatedAt:       '2026-01-20T09:00:00.000Z',
    notes:           'Sudah jatuh tempo',
  },
  {
    id:              'd-003',
    type:            'hutang',
    counterparty:    'Toko Besi Abadi',
    description:     'Besi hollow dan plat besi',
    amount:          4_200_000,
    paidAmount:      4_200_000,
    remainingAmount: 0,
    status:          'lunas',
    dueDate:         '2026-01-31',
    createdAt:       '2025-12-15T07:00:00.000Z',
    updatedAt:       '2026-01-28T14:00:00.000Z',
  },
  {
    id:              'p-001',
    type:            'piutang',
    counterparty:    'Bapak Andi Wijaya',
    description:     'DP proyek renovasi kantor Jl. Gatot Subroto',
    amount:          25_000_000,
    paidAmount:      10_000_000,
    remainingAmount: 15_000_000,
    status:          'sebagian',
    dueDate:         '2026-04-15',
    createdAt:       '2026-01-05T10:00:00.000Z',
    updatedAt:       '2026-02-01T11:00:00.000Z',
    projectId:       'proj-001',
    notes:           'Sisa dibayar setelah finishing',
  },
  {
    id:              'p-002',
    type:            'piutang',
    counterparty:    'PT Maju Bersama',
    description:     'Pemasangan pintu otomatis gedung B',
    amount:          12_000_000,
    paidAmount:      0,
    remainingAmount: 12_000_000,
    status:          'belum_lunas',
    dueDate:         '2026-03-15',
    createdAt:       '2026-02-01T08:30:00.000Z',
    updatedAt:       '2026-02-01T08:30:00.000Z',
  },
  {
    id:              'p-003',
    type:            'piutang',
    counterparty:    'Ibu Sari Dewi',
    description:     'Proyek pagar rumah Perumahan Graha Indah',
    amount:          7_500_000,
    paidAmount:      7_500_000,
    remainingAmount: 0,
    status:          'lunas',
    dueDate:         '2026-01-20',
    createdAt:       '2025-12-01T09:00:00.000Z',
    updatedAt:       '2026-01-18T15:00:00.000Z',
  },
  {
    id:              'p-004',
    type:            'piutang',
    counterparty:    'CV Karya Utama',
    description:     'Termin pertama proyek gudang logistik',
    amount:          30_000_000,
    paidAmount:      0,
    remainingAmount: 30_000_000,
    status:          'belum_lunas',
    dueDate:         '2026-03-30',
    createdAt:       '2026-02-10T10:00:00.000Z',
    updatedAt:       '2026-02-10T10:00:00.000Z',
    projectId:       'proj-002',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function recalcStatus(debt: Debt): Debt {
  if (debt.paidAmount <= 0)                          return { ...debt, status: 'belum_lunas' };
  if (debt.paidAmount >= debt.amount)                return { ...debt, status: 'lunas',      remainingAmount: 0        };
  return { ...debt, status: 'sebagian', remainingAmount: debt.amount - debt.paidAmount };
}

function nowISO() { return new Date().toISOString(); }
function uid()    { return Math.random().toString(36).slice(2, 10); }

// ── Repository ────────────────────────────────────────────────────────────────

export class DebtRepository implements IDebtRepository {

  async getAll(query: GetDebtsQuery): Promise<DebtCollection> {
    await delay(300);

    let filtered = [...DUMMY_DEBTS];

    if (query.type)   filtered = filtered.filter(d => d.type   === query.type);
    if (query.status) filtered = filtered.filter(d => d.status === query.status);
    if (query.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(d =>
        d.counterparty.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
      );
    }

    const page  = query.page  ?? 1;
    const limit = query.limit ?? 20;
    const start = (page - 1) * limit;
    const data  = filtered.slice(start, start + limit);

    return {
      data,
      total:      filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async getById(id: string): Promise<Debt> {
    await delay(200);
    const debt = DUMMY_DEBTS.find(d => d.id === id);
    if (!debt) throw new Error(`Debt ${id} not found`);
    return debt;
  }

  async getSummary(): Promise<DebtSummary> {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];

    const hutangs   = DUMMY_DEBTS.filter(d => d.type === 'hutang'   && d.status !== 'lunas');
    const piutangs  = DUMMY_DEBTS.filter(d => d.type === 'piutang'  && d.status !== 'lunas');

    return {
      totalHutang:       hutangs.reduce((s, d)  => s + d.remainingAmount, 0),
      totalPiutang:      piutangs.reduce((s, d) => s + d.remainingAmount, 0),
      hutangJatuhTempo:  hutangs.filter(d  => d.dueDate && d.dueDate < today).reduce((s, d) => s + d.remainingAmount, 0),
      piutangJatuhTempo: piutangs.filter(d => d.dueDate && d.dueDate < today).reduce((s, d) => s + d.remainingAmount, 0),
      countHutang:       hutangs.length,
      countPiutang:      piutangs.length,
    };
  }

  async create(dto: CreateDebtDTO): Promise<Debt> {
    await delay(400);
    const debt: Debt = recalcStatus({
      id:              (dto.type === 'hutang' ? 'd-' : 'p-') + uid(),
      type:            dto.type,
      counterparty:    dto.counterparty,
      description:     dto.description,
      amount:          dto.amount,
      paidAmount:      0,
      remainingAmount: dto.amount,
      status:          'belum_lunas',
      dueDate:         dto.dueDate ?? null,
      createdAt:       nowISO(),
      updatedAt:       nowISO(),
      projectId:       dto.projectId,
      notes:           dto.notes,
    });
    DUMMY_DEBTS = [debt, ...DUMMY_DEBTS];
    return debt;
  }

  async update(id: string, dto: UpdateDebtDTO): Promise<Debt> {
    await delay(400);
    const idx = DUMMY_DEBTS.findIndex(d => d.id === id);
    if (idx === -1) throw new Error(`Debt ${id} not found`);

    const updated = recalcStatus({
      ...DUMMY_DEBTS[idx],
      ...(dto.counterparty !== undefined && { counterparty: dto.counterparty }),
      ...(dto.description  !== undefined && { description:  dto.description  }),
      ...(dto.amount       !== undefined && {
        amount:          dto.amount,
        remainingAmount: dto.amount - DUMMY_DEBTS[idx].paidAmount,
      }),
      ...(dto.dueDate      !== undefined && { dueDate: dto.dueDate }),
      ...(dto.notes        !== undefined && { notes:   dto.notes   }),
      updatedAt: nowISO(),
    });

    DUMMY_DEBTS = DUMMY_DEBTS.map((d, i) => (i === idx ? updated : d));
    return updated;
  }

  async pay(id: string, dto: PayDebtDTO): Promise<Debt> {
    await delay(400);
    const idx = DUMMY_DEBTS.findIndex(d => d.id === id);
    if (idx === -1) throw new Error(`Debt ${id} not found`);

    const prev       = DUMMY_DEBTS[idx];
    const newPaid    = Math.min(prev.paidAmount + dto.payAmount, prev.amount);
    const updated    = recalcStatus({
      ...prev,
      paidAmount:      newPaid,
      remainingAmount: prev.amount - newPaid,
      notes:           dto.notes ? `${prev.notes ?? ''}\n[Bayar] ${dto.notes}`.trim() : prev.notes,
      updatedAt:       nowISO(),
    });

    DUMMY_DEBTS = DUMMY_DEBTS.map((d, i) => (i === idx ? updated : d));
    return updated;
  }

  async delete(id: string): Promise<void> {
    await delay(300);
    DUMMY_DEBTS = DUMMY_DEBTS.filter(d => d.id !== id);
  }
}

// ── Utility ───────────────────────────────────────────────────────────────────
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
