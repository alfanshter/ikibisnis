/**
 * Organism: AccQuotationModal
 * Modal untuk ACC penawaran.
 * Memungkinkan input nomor PO dari klien (opsional).
 */
'use client';
import React, { useState } from 'react';
import { Quotation, AccQuotationDTO } from '@/src/domain/entities/Quotation';
import { formatCurrency } from '@/src/domain/entities/Project';
import { Icon } from '../atoms/Icon';

interface Props {
  quotation: Quotation;
  saving:    boolean;
  onClose:   () => void;
  onSubmit:  (dto: AccQuotationDTO) => Promise<void>;
}

export const AccQuotationModal: React.FC<Props> = ({ quotation, saving, onClose, onSubmit }) => {
  const [poNumber, setPoNumber] = useState(quotation.poNumber ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ id: quotation.id, poNumber: poNumber.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
              <Icon name="thumb-up" className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">ACC Penawaran</h2>
              <p className="text-slate-400 text-xs">{quotation.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Info penawaran */}
          <div className="bg-slate-700/30 rounded-xl p-4 space-y-2">
            <p className="text-white text-sm font-medium">{quotation.title}</p>
            <p className="text-slate-400 text-xs">Klien: {quotation.client.name}</p>
            <p className="text-emerald-400 text-sm font-semibold">{formatCurrency(quotation.totalValue)}</p>
          </div>

          {/* Nomor PO — opsional */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Nomor PO <span className="text-slate-500 text-xs">(opsional — kosongkan jika tanpa PO)</span>
            </label>
            <input
              type="text"
              value={poNumber}
              onChange={e => setPoNumber(e.target.value)}
              placeholder="Contoh: PO/KOMINFO/2026/001"
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-slate-500 text-xs mt-1.5">
              Nomor PO dapat ditambahkan atau diubah kapan saja setelah project dibuat.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Icon name="loader" className="w-4 h-4 animate-spin" />}
              Konfirmasi ACC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
