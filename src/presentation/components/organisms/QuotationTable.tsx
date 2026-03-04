/**
 * Organism: QuotationTable
 * Full table for listing quotations with filters, search, and pagination.
 */
'use client';
import React from 'react';
import { Quotation, QuotationCollection, QuotationStatus } from '@/src/domain/entities/Quotation';
import { QuotationTableRow } from '../molecules/QuotationTableRow';
import { Icon } from '../atoms/Icon';

const STATUSES: (QuotationStatus | 'Semua')[] = [
  'Semua', 'Draft', 'Terkirim', 'ACC', 'Ditolak', 'Dikonversi',
];

interface Props {
  collection:    QuotationCollection | null;
  loading:       boolean;
  statusFilter:  string;
  search:        string;
  onStatusFilter: (v: string) => void;
  onSearch:       (v: string) => void;
  onPageChange:   (p: number) => void;
  onEdit:         (q: Quotation) => void;
  onDelete:       (q: Quotation) => void;
  onSend:         (q: Quotation) => void;
  onAcc:          (q: Quotation) => void;
  onReject:       (q: Quotation) => void;
  onConvert:      (q: Quotation) => void;
}

const SKELETON = Array.from({ length: 5 });

export const QuotationTable: React.FC<Props> = ({
  collection, loading, statusFilter, search,
  onStatusFilter, onSearch, onPageChange,
  onEdit, onDelete, onSend, onAcc, onReject, onConvert,
}) => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
    {/* ── Toolbar ── */}
    <div className="p-4 border-b border-slate-700/50 flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Cari judul, klien, ID..."
          className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => onStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>

    {/* ── Table ── */}
    <div className="overflow-x-auto">
      <table className="w-full text-left table-fixed">
        <colgroup>
          <col className="w-[28%]" />   {/* Judul */}
          <col className="w-[16%]" />   {/* Klien */}
          <col className="w-[12%]" />   {/* Status */}
          <col className="w-[14%]" />   {/* Kategori */}
          <col className="w-[12%]" />   {/* Valid Hingga */}
          <col className="w-[12%]" />   {/* Nilai */}
          <col className="w-[6%]" />    {/* Aksi */}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-700/50 bg-slate-800/30">
            <th className="px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Judul</th>
            <th className="px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Klien</th>
            <th className="px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Kategori</th>
            <th className="px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Valid Hingga</th>
            <th className="px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider text-right">Nilai</th>
            <th className="px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            SKELETON.map((_, i) => (
              <tr key={i} className="border-b border-slate-700/50">
                {Array.from({ length: 7 }).map((__, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : !collection || collection.quotations.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                Tidak ada penawaran ditemukan.
              </td>
            </tr>
          ) : (
            collection.quotations.map(q => (
              <QuotationTableRow
                key={q.id}
                quotation={q}
                onEdit={onEdit}
                onDelete={onDelete}
                onSend={onSend}
                onAcc={onAcc}
                onReject={onReject}
                onConvert={onConvert}
              />
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* ── Pagination ── */}
    {collection && collection.pagination.totalPages > 1 && (() => {
      const { currentPage, totalPages } = collection.pagination;
      return (
        <div className="p-4 border-t border-slate-700/50 flex items-center justify-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-sm bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <Icon name="chevron-left" className="w-3.5 h-3.5" />Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${p === currentPage ? 'bg-blue-500 text-white' : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'}`}
            >{p}</button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            Next<Icon name="chevron-right" className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    })()}
  </div>
);
