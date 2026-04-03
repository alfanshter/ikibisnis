/**
 * Organism: TransactionModal
 * Modal form to add a new transaction.
 */
'use client';
import React, { useState } from 'react';
import {
  TransactionType,
  TransactionCategory,
  PaymentMethod,
  CreateTransactionDTO,
} from '@/src/domain/entities/Finance';
import { Icon } from '@/src/presentation/components/atoms/Icon';

const INCOME_CATEGORIES: TransactionCategory[] = [
  'Pendapatan Jasa',
  'Pendapatan Barang',
  'Pendapatan Lainnya',
];
const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'Pembelian Barang',
  'Biaya Operasional',
  'Gaji & Upah',
  'Pajak',
  'Utilitas',
  'Pengeluaran Lainnya',
];
const PAYMENT_METHODS: PaymentMethod[] = ['Tunai', 'Transfer Bank', 'QRIS', 'Cek/Giro'];

interface Props {
  saving:    boolean;
  onClose:   () => void;
  onSubmit:  (dto: CreateTransactionDTO) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const TransactionModal: React.FC<Props> = ({ saving, onClose, onSubmit }) => {
  const [type,          setType]          = useState<TransactionType>('Pemasukan');
  const [category,      setCategory]      = useState<TransactionCategory>('Pendapatan Jasa');
  const [date,          setDate]          = useState(today());
  const [description,   setDescription]   = useState('');
  const [amount,        setAmount]        = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transfer Bank');
  const [referenceNo,   setReferenceNo]   = useState('');
  const [createdBy,     setCreatedBy]     = useState('Admin');
  const [errors,        setErrors]        = useState<Record<string, string>>({});

  const categories = type === 'Pemasukan' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setCategory(t === 'Pemasukan' ? 'Pendapatan Jasa' : 'Pembelian Barang');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!date)          e.date        = 'Tanggal wajib diisi';
    if (!description.trim()) e.description = 'Deskripsi wajib diisi';
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) e.amount = 'Nominal harus lebih dari 0';
    if (!createdBy.trim()) e.createdBy = 'Nama petugas wajib diisi';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    const dto: CreateTransactionDTO = {
      date:          new Date(date),
      type,
      category,
      description:   description.trim(),
      amount:        parseFloat(amount),
      paymentMethod,
      referenceNo:   referenceNo.trim() || undefined,
      createdBy:     createdBy.trim(),
    };
    onSubmit(dto);
  };

  const inputCls = (field: string) =>
    `w-full bg-slate-800 border rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500/50'
        : 'border-slate-600 focus:ring-blue-500/50 focus:border-blue-500'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Icon name="receipt" className="text-blue-400 w-4.5 h-4.5" />
            </div>
            <h2 className="text-white font-semibold text-lg">Tambah Transaksi</h2>
          </div>
          <button onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Icon name="x" className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          {/* Tipe Transaksi */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Tipe Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Pemasukan', 'Pengeluaran'] as TransactionType[]).map(t => (
                <button key={t} type="button" onClick={() => handleTypeChange(t)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all border ${
                    type === t
                      ? t === 'Pemasukan'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-red-500/20 border-red-500 text-red-300'
                      : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Tanggal <span className="text-red-400">*</span>
            </label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                   className={inputCls('date')} />
            {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Kategori
            </label>
            <select value={category} onChange={e => setCategory(e.target.value as TransactionCategory)}
                    className={inputCls('category')}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Deskripsi <span className="text-red-400">*</span>
            </label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                   placeholder="Keterangan transaksi…" className={inputCls('description')} />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Nominal (Rp) <span className="text-red-400">*</span>
            </label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                   placeholder="0" min="1" step="1000" className={inputCls('amount')} />
            {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Metode Pembayaran */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Metode Pembayaran
            </label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                    className={inputCls('paymentMethod')}>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* No Referensi */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              No. Referensi <span className="text-slate-600">(opsional)</span>
            </label>
            <input type="text" value={referenceNo} onChange={e => setReferenceNo(e.target.value)}
                   placeholder="INV-2026-XXXX" className={inputCls('referenceNo')} />
          </div>

          {/* Petugas */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Petugas <span className="text-red-400">*</span>
            </label>
            <input type="text" value={createdBy} onChange={e => setCreatedBy(e.target.value)}
                   placeholder="Nama petugas" className={inputCls('createdBy')} />
            {errors.createdBy && <p className="text-red-400 text-xs mt-1">{errors.createdBy}</p>}
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-700 shrink-0">
          <button type="button" onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors">
            Batal
          </button>
          <button type="button" disabled={saving} onClick={handleSubmit as never}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan…</>
              : <><Icon name="check" className="w-4 h-4" />Simpan Transaksi</>}
          </button>
        </div>
      </div>
    </div>
  );
};
