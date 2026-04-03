/**
 * Organism: RejectQuotationModal
 * Modal untuk menolak penawaran beserta alasannya.
 */
'use client';
import React, { useState } from 'react';
import { Quotation, RejectQuotationDTO } from '@/src/domain/entities/Quotation';
import { Icon } from '../../atoms/Icon';

interface Props {
  quotation: Quotation;
  saving:    boolean;
  onClose:   () => void;
  onSubmit:  (dto: RejectQuotationDTO) => Promise<void>;
}

export const RejectQuotationModal: React.FC<Props> = ({ quotation, saving, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ id: quotation.id, reason: reason.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
              <Icon name="thumb-down" className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Tolak Penawaran</h2>
              <p className="text-slate-400 text-xs">{quotation.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-white text-sm font-medium">{quotation.title}</p>
            <p className="text-slate-400 text-xs mt-1">Klien: {quotation.client.name}</p>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Alasan Penolakan <span className="text-slate-500 text-xs">(opsional)</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Misal: Budget tidak tersedia, permintaan harga terlalu tinggi..."
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Icon name="loader" className="w-4 h-4 animate-spin" />}
              Konfirmasi Tolak
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
