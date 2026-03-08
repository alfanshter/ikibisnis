/**
 * Molecule: ProjectStatusBadge
 * Status pill for project status (Baru / Proses / Selesai / Dibayar / Dibatalkan).
 */
'use client';
import React from 'react';
import { ProjectStatus } from '@/src/domain/entities/Project';

interface Props { status: ProjectStatus; className?: string; }

const MAP: Record<ProjectStatus, { dot: string; text: string; bg: string }> = {
  'Baru':       { dot: 'bg-sky-400',    text: 'text-sky-300',    bg: 'bg-sky-500/10 border border-sky-500/20'       },
  'Proses':     { dot: 'bg-amber-400',  text: 'text-amber-300',  bg: 'bg-amber-500/10 border border-amber-500/20'   },
  'Selesai':    { dot: 'bg-emerald-400',text: 'text-emerald-300',bg: 'bg-emerald-500/10 border border-emerald-500/20'},
  'Dibayar':    { dot: 'bg-teal-400',   text: 'text-teal-300',   bg: 'bg-teal-500/10 border border-teal-500/20'     },
  'Dibatalkan': { dot: 'bg-red-400',    text: 'text-red-300',    bg: 'bg-red-500/10 border border-red-500/20'       },
};

export const ProjectStatusBadge: React.FC<Props> = ({ status, className = '' }) => {
  const s = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};
