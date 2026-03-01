/**
 * Molecule: PriorityBadge
 * Small priority indicator pill.
 */
'use client';
import React from 'react';
import { ProjectPriority } from '@/src/domain/entities/Project';

interface Props { priority: ProjectPriority; className?: string; }

const MAP: Record<ProjectPriority, string> = {
  'Rendah': 'bg-slate-700 text-slate-300',
  'Sedang': 'bg-blue-500/20 text-blue-300',
  'Tinggi': 'bg-red-500/20 text-red-300',
};

export const PriorityBadge: React.FC<Props> = ({ priority, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${MAP[priority]} ${className}`}>
    {priority}
  </span>
);
