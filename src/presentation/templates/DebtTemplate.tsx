/**
 * Template: DebtTemplate
 * Halaman Hutang & Piutang — list siapa yang berhutang, siapa yang kita hutangi,
 * pencatatan pembayaran, dan ringkasan total.
 */
'use client';

import React, { useState } from 'react';
import {
  Debt, DebtCollection, DebtSummary,
  CreateDebtDTO, UpdateDebtDTO, PayDebtDTO,
  GetDebtsQuery, DebtType, DebtStatus,
  formatCurrencyIdr,
} from '@/src/domain/entities/Finance';
import { DebtToastState } from '@/src/presentation/hooks/finance/useDebt';
import { Sidebar }  from '@/src/presentation/components/organisms/shared/Sidebar';
import { TopBar }   from '@/src/presentation/components/organisms/shared/TopBar';
import { Icon }     from '@/src/presentation/components/atoms/Icon';
import { usePermission } from '@/src/presentation/hooks/auth/usePermission';

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusLabel(s: DebtStatus): { label: string; cls: string } {
  if (s === 'lunas')       return { label: 'Lunas',       cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  if (s === 'sebagian')    return { label: 'Sebagian',    cls: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  return                          { label: 'Belum Lunas', cls: 'text-red-400 bg-red-500/10 border-red-500/30' };
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isDue(iso: string | null): boolean {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

// ── Summary Cards ─────────────────────────────────────────────────────────────
const SummaryCards: React.FC<{ summary: DebtSummary | null }> = ({ summary }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {[
      { label: 'Total Hutang Kita',     value: summary?.totalHutang,       icon: 'arrow-down', color: 'red',    sub: `${summary?.countHutang ?? 0} pihak` },
      { label: 'Total Piutang Kita',    value: summary?.totalPiutang,      icon: 'arrow-up',   color: 'emerald',sub: `${summary?.countPiutang ?? 0} pihak` },
      { label: 'Hutang Jatuh Tempo',    value: summary?.hutangJatuhTempo,  icon: 'clock',      color: 'amber',  sub: 'perlu dibayar' },
      { label: 'Piutang Jatuh Tempo',   value: summary?.piutangJatuhTempo, icon: 'clock',      color: 'blue',   sub: 'perlu ditagih' },
    ].map(c => (
      <div key={c.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-lg bg-${c.color}-500/10 flex items-center justify-center`}>
            <Icon name={c.icon} className={`w-4 h-4 text-${c.color}-400`} />
          </div>
          <span className="text-slate-400 text-xs font-medium">{c.label}</span>
        </div>
        <p className={`text-${c.color}-400 font-bold text-lg`}>
          {formatCurrencyIdr(c.value ?? 0)}
        </p>
        <p className="text-slate-500 text-xs mt-0.5">{c.sub}</p>
      </div>
    ))}
  </div>
);

// ── Debt Row ──────────────────────────────────────────────────────────────────
interface RowProps {
  debt:      Debt;
  canUpdate: boolean;
  canDelete: boolean;
  onEdit:    (d: Debt) => void;
  onPay:     (d: Debt) => void;
  onDelete:  (d: Debt) => void;
}
const DebtRow: React.FC<RowProps> = ({ debt, canUpdate, canDelete, onEdit, onPay, onDelete }) => {
  const { label, cls } = statusLabel(debt.status);
  const overdue = isDue(debt.dueDate) && debt.status !== 'lunas';
  const pct = debt.amount > 0 ? Math.min(100, (debt.paidAmount / debt.amount) * 100) : 0;

  return (
    <tr className="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors group">
      {/* Pihak */}
      <td className="px-4 py-3">
        <p className="text-white font-semibold text-sm">{debt.counterparty}</p>
        <p className="text-slate-400 text-xs truncate max-w-45">{debt.description}</p>
      </td>
      {/* Total */}
      <td className="px-4 py-3 text-slate-200 text-sm font-medium">
        {formatCurrencyIdr(debt.amount)}
      </td>
      {/* Sudah Dibayar / Progress */}
      <td className="px-4 py-3">
        <p className="text-slate-300 text-sm">{formatCurrencyIdr(debt.paidAmount)}</p>
        <div className="mt-1 h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${debt.status === 'lunas' ? 'bg-emerald-500' : 'bg-blue-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </td>
      {/* Sisa */}
      <td className="px-4 py-3">
        <p className={`text-sm font-semibold ${debt.remainingAmount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
          {formatCurrencyIdr(debt.remainingAmount)}
        </p>
      </td>
      {/* Jatuh Tempo */}
      <td className="px-4 py-3">
        <span className={`text-xs ${overdue ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
          {overdue && <Icon name="alert" className="w-3 h-3 inline mr-1" />}
          {fmtDate(debt.dueDate)}
        </span>
      </td>
      {/* Status */}
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${cls}`}>
          {label}
        </span>
      </td>
      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Bayar / Terima — only if not lunas */}
          {debt.status !== 'lunas' && (
            canUpdate ? (
              <button
                onClick={() => onPay(debt)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-lg transition-all"
                title={debt.type === 'hutang' ? 'Catat Pembayaran' : 'Terima Pembayaran'}
              >
                <Icon name="check" className="w-3 h-3" />
                Bayar
              </button>
            ) : (
              <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Tidak ada izin">
                <Icon name="lock" className="w-3.5 h-3.5" />
              </span>
            )
          )}
          {canUpdate ? (
            <button onClick={() => onEdit(debt)}
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
              title="Edit">
              <Icon name="edit" className="w-4 h-4" />
            </button>
          ) : (
            <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Tidak ada izin edit">
              <Icon name="lock" className="w-4 h-4" />
            </span>
          )}
          {canDelete ? (
            <button onClick={() => onDelete(debt)}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              title="Hapus">
              <Icon name="trash" className="w-4 h-4" />
            </button>
          ) : (
            <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Tidak ada izin hapus">
              <Icon name="lock" className="w-4 h-4" />
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

// ── Create / Edit Modal ───────────────────────────────────────────────────────
interface DebtModalProps {
  open:         boolean;
  saving:       boolean;
  mode:         'create' | 'edit';
  initialType?: DebtType;
  debt?:        Debt | null;
  onClose:      () => void;
  onSubmit:     (dto: CreateDebtDTO | UpdateDebtDTO) => void;
}
const DebtModal: React.FC<DebtModalProps> = ({ open, saving, mode, initialType = 'hutang', debt, onClose, onSubmit }) => {
  const [type,         setType]         = useState<DebtType>(debt?.type ?? initialType);
  const [counterparty, setCounterparty] = useState(debt?.counterparty ?? '');
  const [description,  setDescription]  = useState(debt?.description  ?? '');
  const [amount,       setAmount]       = useState(String(debt?.amount ?? ''));
  const [dueDate,      setDueDate]      = useState(debt?.dueDate ? debt.dueDate.split('T')[0] : '');
  const [notes,        setNotes]        = useState(debt?.notes ?? '');
  const [errors,       setErrors]       = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      setType(debt?.type ?? initialType);
      setCounterparty(debt?.counterparty ?? '');
      setDescription(debt?.description   ?? '');
      setAmount(String(debt?.amount ?? ''));
      setDueDate(debt?.dueDate ? debt.dueDate.split('T')[0] : '');
      setNotes(debt?.notes ?? '');
      setErrors({});
    }
  }, [open, debt, initialType]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!counterparty.trim()) e.counterparty = 'Nama pihak wajib diisi';
    if (!description.trim())  e.description  = 'Keterangan wajib diisi';
    const n = parseFloat(amount);
    if (!amount || isNaN(n) || n <= 0) e.amount = 'Jumlah harus lebih dari 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const base = {
      counterparty: counterparty.trim(),
      description:  description.trim(),
      amount:       parseFloat(amount),
      dueDate:      dueDate || undefined,
      notes:        notes.trim() || undefined,
    };
    if (mode === 'create') {
      onSubmit({ ...base, type } as CreateDebtDTO);
    } else {
      onSubmit(base as UpdateDebtDTO);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h3 className="text-white font-semibold text-lg">
            {mode === 'create' ? 'Tambah Hutang / Piutang' : 'Edit Data'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipe — only on create */}
          {mode === 'create' && (
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2">Jenis</label>
              <div className="grid grid-cols-2 gap-2">
                {(['hutang', 'piutang'] as DebtType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      type === t
                        ? t === 'hutang'
                          ? 'bg-red-500/20 border-red-500/60 text-red-400'
                          : 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                        : 'bg-slate-700/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {t === 'hutang' ? '↓ Hutang (kita berhutang)' : '↑ Piutang (kita menghutangi)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nama Pihak */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">
              {type === 'hutang' ? 'Nama Pemberi Hutang' : 'Nama Pihak Yang Berhutang'}
            </label>
            <input
              value={counterparty}
              onChange={e => setCounterparty(e.target.value)}
              placeholder="Nama orang / perusahaan..."
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70"
            />
            {errors.counterparty && <p className="text-red-400 text-xs mt-1">{errors.counterparty}</p>}
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Keterangan</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Untuk keperluan apa..."
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Jumlah (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              min="1"
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70"
            />
            {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Jatuh Tempo */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Jatuh Tempo (opsional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500/70"
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Catatan (opsional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Catatan tambahan..."
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60 rounded-xl transition-colors">
              {saving ? 'Menyimpan...' : mode === 'create' ? 'Simpan' : 'Perbarui'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Pay Modal ─────────────────────────────────────────────────────────────────
interface PayModalProps {
  open:    boolean;
  saving:  boolean;
  debt:    Debt | null;
  onClose: () => void;
  onSubmit:(dto: PayDebtDTO) => void;
}
const PayModal: React.FC<PayModalProps> = ({ open, saving, debt, onClose, onSubmit }) => {
  const [payAmount, setPayAmount] = useState('');
  const [notes,     setNotes]     = useState('');
  const [error,     setError]     = useState('');

  React.useEffect(() => {
    if (open) { setPayAmount(''); setNotes(''); setError(''); }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(payAmount);
    if (!payAmount || isNaN(n) || n <= 0) { setError('Jumlah pembayaran harus lebih dari 0'); return; }
    if (debt && n > debt.remainingAmount)  { setError(`Maksimal ${formatCurrencyIdr(debt.remainingAmount)}`); return; }
    setError('');
    onSubmit({ payAmount: n, notes: notes.trim() || undefined });
  };

  if (!open || !debt) return null;

  const isHutang = debt.type === 'hutang';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h3 className="text-white font-semibold text-lg">
              {isHutang ? '💸 Catat Pembayaran Hutang' : '💰 Terima Pembayaran Piutang'}
            </h3>
            <p className="text-slate-400 text-sm mt-0.5">{debt.counterparty}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Ringkasan */}
          <div className="bg-slate-700/30 border border-slate-700/50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total</span>
              <span className="text-white font-medium">{formatCurrencyIdr(debt.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sudah dibayar</span>
              <span className="text-emerald-400">{formatCurrencyIdr(debt.paidAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700/50 pt-2">
              <span className="text-slate-300 font-medium">Sisa</span>
              <span className="text-red-400 font-bold">{formatCurrencyIdr(debt.remainingAmount)}</span>
            </div>
          </div>

          {/* Jumlah bayar */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">
              Jumlah yang {isHutang ? 'dibayarkan' : 'diterima'} (Rp)
            </label>
            <input
              type="number"
              value={payAmount}
              onChange={e => setPayAmount(e.target.value)}
              placeholder="0"
              min="1"
              max={debt.remainingAmount}
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            <button
              type="button"
              onClick={() => setPayAmount(String(debt.remainingAmount))}
              className="mt-1.5 text-xs text-blue-400 hover:text-blue-300"
            >
              Lunas sekaligus ({formatCurrencyIdr(debt.remainingAmount)})
            </button>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Catatan (opsional)</label>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Mis. Transfer BCA, bukti no 123..."
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 rounded-xl transition-colors">
              {saving ? 'Menyimpan...' : 'Konfirmasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Delete Confirm ────────────────────────────────────────────────────────────
const DeleteConfirm: React.FC<{ debt: Debt | null; saving: boolean; onClose: () => void; onConfirm: () => void }> =
  ({ debt, saving, onClose, onConfirm }) => {
    if (!debt) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
              <Icon name="trash" className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Hapus data ini?</h3>
              <p className="text-slate-400 text-sm mt-1">
                <span className="font-semibold text-white">{debt.counterparty}</span> — {formatCurrencyIdr(debt.amount)}
              </p>
              <p className="text-red-400 text-xs mt-1">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors">
              Batal
            </button>
            <button onClick={onConfirm} disabled={saving}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 rounded-xl transition-colors">
              {saving ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    );
  };

// ── Template Props ────────────────────────────────────────────────────────────
interface DebtTemplateProps {
  collection:       DebtCollection | null;
  summary:          DebtSummary | null;
  query:            GetDebtsQuery;
  listLoading:      boolean;
  saving:           boolean;
  toast:            DebtToastState | null;
  showCreateModal:  boolean;
  showEditModal:    boolean;
  showPayModal:     boolean;
  editingDebt:      Debt | null;
  payingDebt:       Debt | null;
  deletingDebt:     Debt | null;
  openCreate:       () => void;
  closeCreate:      () => void;
  openEdit:         (d: Debt) => void;
  closeEdit:        () => void;
  openPay:          (d: Debt) => void;
  closePay:         () => void;
  openDelete:       (d: Debt) => void;
  closeDelete:      () => void;
  onCreate:         (dto: CreateDebtDTO) => void;
  onUpdate:         (id: string, dto: UpdateDebtDTO) => void;
  onPay:            (id: string, dto: PayDebtDTO) => void;
  onDelete:         () => void;
  setTypeFilter:    (t: DebtType | undefined) => void;
  setSearchFilter:  (s: string) => void;
  setStatusFilter:  (s: GetDebtsQuery['status']) => void;
  setPage:          (p: number) => void;
}

// ── Main Template ─────────────────────────────────────────────────────────────
export const DebtTemplate: React.FC<DebtTemplateProps> = ({
  collection, summary, query,
  listLoading, saving, toast,
  showCreateModal, showEditModal, showPayModal,
  editingDebt, payingDebt, deletingDebt,
  openCreate, closeCreate, openEdit, closeEdit,
  openPay, closePay, openDelete, closeDelete,
  onCreate, onUpdate, onPay, onDelete,
  setTypeFilter, setSearchFilter, setStatusFilter, setPage,
}) => {
  const { canWrite, canUpdate, canDelete } = usePermission('hutang_piutang');
  const [activeTab, setActiveTab] = useState<DebtType | 'semua'>('semua');

  const handleTabChange = (t: DebtType | 'semua') => {
    setActiveTab(t);
    setTypeFilter(t === 'semua' ? undefined : t);
  };

  const TABS: { key: DebtType | 'semua'; label: string }[] = [
    { key: 'semua',    label: 'Semua' },
    { key: 'hutang',   label: '↓ Hutang (kita berhutang)' },
    { key: 'piutang',  label: '↑ Piutang (kita menghutangi)' },
  ];

  const TABLE_HEADERS = ['Pihak / Keterangan', 'Jumlah', 'Sudah Dibayar', 'Sisa', 'Jatuh Tempo', 'Status', 'Aksi'];

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activePage="Finance" />

      <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8">
        <TopBar
          title="Hutang & Piutang"
          subtitle="Pantau hutang Anda dan piutang yang belum dibayar."
          action={
            canWrite ? (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                <Icon name="plus" className="w-4 h-4" />
                Tambah
              </button>
            ) : (
              <span className="flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-slate-500 font-semibold text-sm rounded-xl cursor-not-allowed border border-slate-700/50" title="Tidak ada izin">
                <Icon name="lock" className="w-4 h-4" />
                Tambah
              </span>
            )
          }
        />

        {/* Summary */}
        <SummaryCards summary={summary} />

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-slate-800/50 border border-slate-700/50 p-1 rounded-xl w-fit">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-48">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama / keterangan..."
              defaultValue={query.search ?? ''}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70"
            />
          </div>
          <select
            value={query.status ?? ''}
            onChange={e => setStatusFilter((e.target.value as GetDebtsQuery['status']) || undefined)}
            className="px-3 py-2 bg-slate-800 border border-slate-700/50 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/70"
          >
            <option value="">Semua Status</option>
            <option value="belum_lunas">Belum Lunas</option>
            <option value="sebagian">Sebagian</option>
            <option value="lunas">Lunas</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {TABLE_HEADERS.map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-widest uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-slate-700/50">
                      {TABLE_HEADERS.map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !collection || collection.data.length === 0 ? (
                  <tr>
                    <td colSpan={TABLE_HEADERS.length} className="px-4 py-16 text-center text-slate-500">
                      <Icon name="inbox" className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>Belum ada data hutang / piutang</p>
                    </td>
                  </tr>
                ) : (
                  collection.data.map(debt => (
                    <DebtRow
                      key={debt.id}
                      debt={debt}
                      canUpdate={canUpdate}
                      canDelete={canDelete}
                      onEdit={openEdit}
                      onPay={openPay}
                      onDelete={openDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {collection && collection.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50 text-sm text-slate-400">
              <span>{collection.total} data</span>
              <div className="flex gap-1">
                {Array.from({ length: collection.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      p === collection.page
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium
          ${toast.type === 'success'
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
            : 'bg-red-500/20 border border-red-500/40 text-red-300'}`}>
          <Icon name={toast.type === 'success' ? 'check-circle' : 'x-circle'} className="w-4 h-4 shrink-0" />
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      <DebtModal
        open={showCreateModal}
        saving={saving}
        mode="create"
        initialType={activeTab === 'semua' ? 'hutang' : activeTab as DebtType}
        onClose={closeCreate}
        onSubmit={dto => onCreate(dto as CreateDebtDTO)}
      />
      <DebtModal
        open={showEditModal}
        saving={saving}
        mode="edit"
        debt={editingDebt}
        onClose={closeEdit}
        onSubmit={dto => editingDebt && onUpdate(editingDebt.id, dto as UpdateDebtDTO)}
      />
      <PayModal
        open={showPayModal}
        saving={saving}
        debt={payingDebt}
        onClose={closePay}
        onSubmit={dto => payingDebt && onPay(payingDebt.id, dto)}
      />
      <DeleteConfirm
        debt={deletingDebt}
        saving={saving}
        onClose={closeDelete}
        onConfirm={onDelete}
      />
    </div>
  );
};
