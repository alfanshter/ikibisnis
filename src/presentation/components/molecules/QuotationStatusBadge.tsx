/**
 * Molecule: QuotationStatusBadge
 * Status pill for quotation status.
 */
'use client';
import React from 'react';
import { QuotationStatus } from '@/src/domain/entities/Quotation';

interface Props { status: QuotationStatus; className?: string; }

const MAP: Record<QuotationStatus, { dot: string; text: string; bg: string }> = {
  'Draft':       { dot: 'bg-slate-400',  text: 'text-slate-300',   bg: 'bg-slate-500/10 border border-slate-500/20'   },
  'Terkirim':    { dot: 'bg-blue-400',   text: 'text-blue-300',    bg: 'bg-blue-500/10 border border-blue-500/20'     },
  'ACC':         { dot: 'bg-emerald-400',text: 'text-emerald-300', bg: 'bg-emerald-500/10 border border-emerald-500/20'},
  'Ditolak':     { dot: 'bg-red-400',    text: 'text-red-300',     bg: 'bg-red-500/10 border border-red-500/20'       },
  'Dikonversi':  { dot: 'bg-violet-400', text: 'text-violet-300',  bg: 'bg-violet-500/10 border border-violet-500/20' },
};

export const QuotationStatusBadge: React.FC<Props> = ({ status, className = '' }) => {
  const s = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};
