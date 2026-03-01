/**
 * Organism: ProjectDetailPanel
 * Slide-in right panel showing full project details + quick status change.
 */
'use client';
import React from 'react';
import { Project, ProjectStatus, formatCurrency } from '@/src/domain/entities/Project';
import { CategoryBadge } from '../molecules/CategoryBadge';
import { ProjectStatusBadge } from '../molecules/ProjectStatusBadge';
import { PriorityBadge } from '../molecules/PriorityBadge';
import { Icon } from '../atoms/Icon';

const STATUSES: ProjectStatus[] = ['Baru', 'Proses', 'Selesai', 'Dibatalkan'];

interface Props {
  project: Project;
  saving:  boolean;
  onClose:        () => void;
  onEdit:         () => void;
  onStatusChange: (status: ProjectStatus) => void;
}

export const ProjectDetailPanel: React.FC<Props> = ({ project, saving, onClose, onEdit, onStatusChange }) => (
  <aside className="w-96 shrink-0 bg-slate-800/80 border-l border-slate-700/50 flex flex-col h-full overflow-y-auto">
    {/* Header */}
    <div className="p-5 border-b border-slate-700/50 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-mono mb-1">{project.id}</p>
        <h2 className="text-white font-semibold text-sm leading-snug">{project.title}</h2>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-white shrink-0 p-1 rounded hover:bg-slate-700/50">
        <Icon name="x" className="w-5 h-5" />
      </button>
    </div>

    <div className="flex-1 p-5 space-y-5 overflow-y-auto">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <CategoryBadge category={project.category} />
        <ProjectStatusBadge status={project.status} />
        <PriorityBadge priority={project.priority} />
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
      )}

      {/* Client */}
      <Section title="Klien" icon="building">
        <Row label="Nama"     value={project.client.name} />
        <Row label="Kontak"   value={project.client.contact} />
        {project.client.institution && <Row label="Instansi" value={project.client.institution} />}
      </Section>

      {/* Details */}
      <Section title="Detail Proyek" icon="list">
        <Row label="Ditugaskan" value={project.assignedTo} />
        <Row label="Dibuat"     value={new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
        <Row label="Deadline"   value={new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
        {project.completedAt && <Row label="Selesai" value={new Date(project.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />}
      </Section>

      {/* Items */}
      <Section title="Item Pengadaan" icon="package">
        <div className="space-y-2">
          {project.items.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="text-white truncate">{item.name}</p>
                <p className="text-slate-500 text-xs">{item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}</p>
              </div>
              <span className="text-emerald-400 font-medium whitespace-nowrap shrink-0">
                {formatCurrency(item.quantity * item.unitPrice)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between">
          <span className="text-slate-400 text-sm">Total</span>
          <span className="text-emerald-400 font-bold">{formatCurrency(project.totalValue)}</span>
        </div>
      </Section>

      {/* Notes */}
      {project.notes && (
        <Section title="Catatan" icon="list">
          <p className="text-slate-400 text-sm leading-relaxed">{project.notes}</p>
        </Section>
      )}

      {/* Quick Status Change */}
      <Section title="Ubah Status" icon="check-circle">
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              disabled={project.status === s || saving}
              className={`py-2 rounded-lg text-xs font-medium transition-colors border
                ${project.status === s
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-300 cursor-default'
                  : 'border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-700 hover:text-white'}
                disabled:opacity-50`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>
    </div>

    {/* Footer */}
    <div className="p-5 border-t border-slate-700/50 shrink-0">
      <button
        onClick={onEdit}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Icon name="edit" className="w-4 h-4" /> Edit Proyek
      </button>
    </div>
  </aside>
);

/* ── Helpers ── */
const Section: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon name={icon} className="w-4 h-4 text-slate-500" />
      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
    </div>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start text-sm py-1 border-b border-slate-700/30 last:border-0">
    <span className="text-slate-500 shrink-0 mr-3">{label}</span>
    <span className="text-slate-200 text-right">{value}</span>
  </div>
);
