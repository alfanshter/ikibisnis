/**
 * Template: ProjectDetailTemplate
 * Full-page project detail view — opened when user clicks the 👁 (view) button.
 * Replaces the old slide-in ProjectDetailPanel approach.
 */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectStatus, formatCurrency } from '@/src/domain/entities/Project';
import { Sidebar } from '../organisms/Sidebar';
import { TopBar } from '../organisms/TopBar';
import { Icon } from '../atoms/Icon';
import { CategoryBadge } from '../molecules/CategoryBadge';
import { ProjectStatusBadge } from '../molecules/ProjectStatusBadge';
import { PriorityBadge } from '../molecules/PriorityBadge';

const STATUSES: ProjectStatus[] = ['Baru', 'Proses', 'Selesai', 'Dibatalkan'];

const STATUS_COLOR: Record<ProjectStatus, string> = {
  Baru:       'bg-sky-500/10    border-sky-500/40    text-sky-300',
  Proses:     'bg-amber-500/10  border-amber-500/40  text-amber-300',
  Selesai:    'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
  Dibatalkan: 'bg-red-500/10    border-red-500/40    text-red-300',
};

export interface ProjectDetailTemplateProps {
  project:  Project;
  saving:   boolean;
  onEdit:         () => void;
  onStatusChange: (status: ProjectStatus) => void;
}

export const ProjectDetailTemplate: React.FC<ProjectDetailTemplateProps> = ({
  project,
  saving,
  onEdit,
  onStatusChange,
}) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activePage="Projects" />

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="px-6 lg:px-10 pt-8 pb-12 max-w-5xl mx-auto">

          {/* ── Top Bar ── */}
          <TopBar
            title="Detail Proyek"
            subtitle={project.id}
            action={
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700/60 transition-all"
                >
                  <Icon name="chevron-left" className="w-4 h-4" />
                  Kembali
                </button>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  <Icon name="edit" className="w-4 h-4" />
                  Edit Proyek
                </button>
              </div>
            }
          />

          {/* ── Header Card ── */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-slate-500 text-xs font-mono mb-1">{project.id}</p>
                <h1 className="text-white text-2xl font-bold leading-tight mb-3">{project.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge category={project.category} />
                  <ProjectStatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-slate-500 text-xs mb-1">Total Nilai</p>
                <p className="text-emerald-400 text-2xl font-bold">{formatCurrency(project.totalValue)}</p>
              </div>
            </div>
            {project.description && (
              <p className="text-slate-400 text-sm leading-relaxed mt-4 pt-4 border-t border-slate-700/40">
                {project.description}
              </p>
            )}
          </div>

          {/* ── Two Column Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Left col: items table (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Items */}
              <Card title="Item Pengadaan" icon="package">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left text-slate-500 font-semibold pb-2 pr-4">Nama Item</th>
                        <th className="text-right text-slate-500 font-semibold pb-2 px-4">Qty</th>
                        <th className="text-right text-slate-500 font-semibold pb-2 px-4">Harga Satuan</th>
                        <th className="text-right text-slate-500 font-semibold pb-2 pl-4">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {project.items.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-700/10 transition-colors">
                          <td className="py-3 pr-4 text-white">{item.name}</td>
                          <td className="py-3 px-4 text-right text-slate-400">{item.quantity} {item.unit}</td>
                          <td className="py-3 px-4 text-right text-slate-400">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-3 pl-4 text-right text-emerald-400 font-medium">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-700/50">
                        <td colSpan={3} className="pt-3 text-slate-400 font-semibold">Total</td>
                        <td className="pt-3 text-right text-emerald-400 font-bold text-base">
                          {formatCurrency(project.totalValue)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>

              {/* Notes */}
              {project.notes && (
                <Card title="Catatan" icon="list">
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{project.notes}</p>
                </Card>
              )}
            </div>

            {/* Right col: meta + client + status (1/3 width) */}
            <div className="space-y-6">

              {/* Client */}
              <Card title="Informasi Klien" icon="building">
                <InfoRow label="Nama"     value={project.client.name} />
                <InfoRow label="Kontak"   value={project.client.contact} />
                {project.client.institution && (
                  <InfoRow label="Instansi" value={project.client.institution} />
                )}
              </Card>

              {/* Timeline */}
              <Card title="Timeline" icon="clock">
                <InfoRow
                  label="Dibuat"
                  value={new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                />
                <InfoRow
                  label="Deadline"
                  value={new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                />
                {project.completedAt && (
                  <InfoRow
                    label="Selesai"
                    value={new Date(project.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                )}
                <InfoRow label="Ditugaskan ke" value={project.assignedTo} />
              </Card>

              {/* Status Change */}
              <Card title="Ubah Status" icon="check-circle">
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(s)}
                      disabled={project.status === s || saving}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 ${
                        project.status === s
                          ? STATUS_COLOR[s] + ' cursor-default'
                          : 'border-slate-700/50 bg-slate-700/30 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer'
                      }`}
                    >
                      {saving && project.status !== s ? (
                        <span className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        </span>
                      ) : s}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ── Internal helpers ── */
const Card: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon name={icon} className="w-4 h-4 text-slate-500" />
      <h3 className="text-slate-300 text-xs font-bold uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start text-sm py-2 border-b border-slate-700/30 last:border-0 gap-3">
    <span className="text-slate-500 shrink-0">{label}</span>
    <span className="text-slate-200 text-right break-all">{value}</span>
  </div>
);
