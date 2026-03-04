/**
 * Molecule: QuotationTableRow
 * A single row in the quotations table.
 */
'use client';
import React from 'react';
import { Quotation } from '@/src/domain/entities/Quotation';
import { QuotationStatusBadge } from './QuotationStatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { Icon } from '../atoms/Icon';
import { formatCurrency, ProjectCategory } from '@/src/domain/entities/Project';

interface Props {
  quotation: Quotation;
  onEdit:    (q: Quotation) => void;
  onDelete:  (q: Quotation) => void;
  onSend:    (q: Quotation) => void;
  onAcc:     (q: Quotation) => void;
  onReject:  (q: Quotation) => void;
  onConvert: (q: Quotation) => void;
}

export const QuotationTableRow: React.FC<Props> = ({
  quotation: q, onEdit, onDelete, onSend, onAcc, onReject, onConvert,
}) => {
  const isExpired = q.status !== 'Dikonversi' && q.status !== 'Ditolak' && new Date(q.validUntil) < new Date();

  return (
    <tr className="group border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
      {/* ID + Title */}
      <td className="px-4 py-4">
        <div>
          <p className="text-xs text-slate-500 font-mono mb-0.5">{q.id}</p>
          <p className="text-white text-sm font-medium truncate max-w-[18rem]">{q.title}</p>
          {q.poNumber && (
            <p className="text-xs text-amber-400 mt-0.5">PO: {q.poNumber}</p>
          )}
        </div>
      </td>

      {/* Klien */}
      <td className="px-4 py-4">
        <p className="text-slate-300 text-sm truncate">{q.client.name}</p>
        {q.client.institution && (
          <p className="text-slate-500 text-xs truncate">{q.client.institution}</p>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <QuotationStatusBadge status={q.status} />
          {isExpired && (
            <span className="text-xs text-red-400">Kedaluwarsa</span>
          )}
        </div>
      </td>

      {/* Kategori */}
      <td className="px-4 py-4">
        <CategoryBadge category={q.category as ProjectCategory} />
      </td>

      {/* Valid Hingga */}
      <td className="px-4 py-4">
        <span className={`text-sm ${isExpired ? 'text-red-400' : 'text-slate-400'}`}>
          {new Date(q.validUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </td>

      {/* Nilai */}
      <td className="px-4 py-4 text-right">
        <span className="text-emerald-400 font-semibold text-sm whitespace-nowrap tabular-nums">
          {formatCurrency(q.totalValue)}
        </span>
      </td>

      {/* Aksi */}
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Edit — hanya Draft */}
          {q.status === 'Draft' && (
            <button
              onClick={() => onEdit(q)}
              title="Edit"
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            >
              <Icon name="pencil" className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Kirim — hanya Draft */}
          {q.status === 'Draft' && (
            <button
              onClick={() => onSend(q)}
              title="Kirim ke Klien"
              className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
            >
              <Icon name="send" className="w-3.5 h-3.5" />
            </button>
          )}
          {/* ACC — hanya Terkirim */}
          {q.status === 'Terkirim' && (
            <button
              onClick={() => onAcc(q)}
              title="ACC Penawaran"
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
            >
              <Icon name="thumb-up" className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Tolak — hanya Terkirim */}
          {q.status === 'Terkirim' && (
            <button
              onClick={() => onReject(q)}
              title="Tolak Penawaran"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Icon name="thumb-down" className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Konversi ke Project — hanya ACC */}
          {q.status === 'ACC' && (
            <button
              onClick={() => onConvert(q)}
              title="Konversi ke Project"
              className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
            >
              <Icon name="swap" className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Hapus — hanya Draft */}
          {q.status === 'Draft' && (
            <button
              onClick={() => onDelete(q)}
              title="Hapus"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Icon name="trash" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
