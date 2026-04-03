/**
 * Molecule: ProjectTableRow
 * A single row in the projects table.
 */
'use client';
import React from 'react';
import { Project, formatCurrency } from '@/src/domain/entities/Project';
import { CategoryBadge } from './CategoryBadge';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Icon } from '../../atoms/Icon';

interface Props {
  project: Project;
  onEdit:   (p: Project) => void;
  onDelete: (p: Project) => void;
  onView:   (p: Project) => void;
}

function deadlineLabel(deadline: Date): { text: string; cls: string } {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (diff < 0)  return { text: 'Terlambat',         cls: 'text-red-400' };
  if (diff === 0) return { text: 'Hari ini',          cls: 'text-amber-400' };
  if (diff <= 3)  return { text: `${diff} hari lagi`, cls: 'text-amber-400' };
  return { text: new Date(deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), cls: 'text-slate-400' };
}

export const ProjectTableRow: React.FC<Props> = ({ project, onEdit, onDelete, onView }) => {
  const dl = deadlineLabel(project.deadline);
  return (
    <tr className="group border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
      {/* ID + Title */}
      <td className="px-4 py-4">
        <div>
          <p className="text-xs text-slate-500 font-mono mb-0.5">{project.nomorProyek ?? project.id}</p>
          <p className="text-white font-medium text-sm leading-snug truncate">{project.title}</p>
          <p className="text-slate-500 text-xs truncate">{project.description}</p>
          {project.billingType && project.billingType !== 'Reguler' && (
            <span className={`inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold leading-none ${
              project.billingType === 'Termin'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {project.billingType === 'Termin' ? '⚡ Termin' : '🔄 Sewa'}
            </span>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-4">
        <CategoryBadge category={project.category} />
      </td>

      {/* Client */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            <Icon name="building" className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{project.client.name}</p>
            {project.client.institution && (
              <p className="text-slate-500 text-xs truncate">{project.client.institution}</p>
            )}
          </div>
        </div>
      </td>

      {/* Status + Priority */}
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1.5">
          <ProjectStatusBadge status={project.status} />
          <PriorityBadge priority={project.priority} />
        </div>
      </td>

      {/* Deadline */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Icon name="calendar" className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className={`text-sm whitespace-nowrap ${dl.cls}`}>{dl.text}</span>
        </div>
      </td>

      {/* Value */}
      <td className="px-4 py-4 text-right">
        <span className="text-emerald-400 font-semibold text-sm whitespace-nowrap tabular-nums">
          {formatCurrency(project.totalValue)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(project)}
            className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded transition-colors"
            title="Lihat Detail"
          >
            <Icon name="eye" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
            title="Edit"
          >
            <Icon name="edit" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            title="Hapus"
          >
            <Icon name="trash" className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
