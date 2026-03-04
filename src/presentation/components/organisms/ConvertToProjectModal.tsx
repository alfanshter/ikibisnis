/**
 * Organism: ConvertToProjectModal
 * Modal untuk mengonversi penawaran ACC menjadi Project.
 * Meminta input tanggal deadline.
 */
'use client';
import React, { useState } from 'react';
import { Quotation } from '@/src/domain/entities/Quotation';
import { formatCurrency } from '@/src/domain/entities/Project';
import { Icon } from '../atoms/Icon';

interface Props {
  quotation: Quotation;
  saving:    boolean;
  onClose:   () => void;
  onSubmit:  (quotationId: string, deadline: Date) => Promise<void>;
}

export const ConvertToProjectModal: React.FC<Props> = ({ quotation, saving, onClose, onSubmit }) => {
  const [deadline, setDeadline] = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadline) { setError('Deadline project wajib diisi.'); return; }
    setError('');
    await onSubmit(quotation.id, new Date(deadline));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center">
              <Icon name="swap" className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Konversi ke Project</h2>
              <p className="text-slate-400 text-xs">{quotation.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Ringkasan penawaran */}
          <div className="bg-slate-700/30 rounded-xl p-4 space-y-2">
            <p className="text-white text-sm font-medium">{quotation.title}</p>
            <p className="text-slate-400 text-xs">Klien: {quotation.client.name}</p>
            <p className="text-emerald-400 text-sm font-semibold">{formatCurrency(quotation.totalValue)}</p>
            {quotation.poNumber && (
              <div className="flex items-center gap-1.5">
                <Icon name="document" className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 text-xs">PO: {quotation.poNumber}</span>
              </div>
            )}
          </div>

          {/* Info alur */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
            <p className="text-blue-300 text-xs leading-relaxed">
              Penawaran ini akan dikonversi menjadi <strong>Project</strong> dengan status <strong>Baru</strong>.
              Status penawaran akan berubah menjadi <strong>Dikonversi</strong>.
            </p>
          </div>

          {/* Deadline project */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Deadline Project <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Icon name="loader" className="w-4 h-4 animate-spin" />}
              Buat Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
