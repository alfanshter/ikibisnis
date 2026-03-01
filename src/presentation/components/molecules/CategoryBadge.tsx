/**
 * Molecule: CategoryBadge
 * Colored pill badge for project categories.
 */
'use client';
import React from 'react';
import { ProjectCategory } from '@/src/domain/entities/Project';

interface Props { category: ProjectCategory; className?: string; }

const MAP: Record<ProjectCategory, string> = {
  'Pengadaan Barang':    'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Pengadaan Jasa':      'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  'Pengadaan ATK':       'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  'Pengadaan Komputer':  'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  'Pengadaan Furniture': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  'Lainnya':             'bg-slate-500/20 text-slate-300 border border-slate-500/30',
};

export const CategoryBadge: React.FC<Props> = ({ category, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${MAP[category]} ${className}`}>
    {category}
  </span>
);
