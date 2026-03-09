/**
 * Organism: ProjectTable
 * Full table listing projects with filters, search, loading skeleton, pagination.
 */
'use client';
import React from 'react';
import { Project, ProjectCollection, ProjectCategory, ProjectStatus } from '@/src/domain/entities/Project';
import { ProjectTableRow } from '../molecules/ProjectTableRow';
import { Pagination } from '../molecules/Pagination';
import { Icon } from '../atoms/Icon';

const STATUSES: (ProjectStatus | 'Semua')[] = ['Semua', 'Baru', 'Pending', 'Proses', 'Selesai', 'Dibayar', 'Dibatalkan'];
const CATEGORIES: (ProjectCategory | 'Semua')[] = [
  'Semua',
  'Pengadaan Barang',
  'Pengadaan Jasa',
  'Pengadaan ATK',
  'Pengadaan Komputer',
  'Pengadaan Furniture',
  'Lainnya',
];

type BillingTab = 'Semua' | 'Reguler' | 'Termin' | 'Sewa';
const BILLING_TABS: { key: BillingTab; label: string; icon: string; color: string }[] = [
  { key: 'Semua',   label: 'Semua',         icon: '📋', color: 'text-slate-300 border-slate-400'   },
  { key: 'Reguler', label: 'Langsung Bayar', icon: '💳', color: 'text-slate-300 border-slate-400'   },
  { key: 'Termin',  label: 'Termin',         icon: '⚡', color: 'text-purple-300 border-purple-400' },
  { key: 'Sewa',    label: 'Sewa',           icon: '🔄', color: 'text-blue-300 border-blue-400'     },
];

interface Props {
  collection:         ProjectCollection;
  loading:            boolean;
  statusFilter:       string;
  categoryFilter:     string;
  billingTypeFilter:  string;
  search:             string;
  onStatusChange:        (v: string) => void;
  onCategoryChange:      (v: string) => void;
  onBillingTypeChange:   (v: string) => void;
  onSearchChange:        (v: string) => void;
  onPageChange:          (p: number) => void;
  onEdit:   (p: Project) => void;
  onDelete: (p: Project) => void;
  onView:   (p: Project) => void;
}

const SKELETON = Array.from({ length: 5 });

export const ProjectTable: React.FC<Props> = ({
  collection, loading,
  statusFilter, categoryFilter, billingTypeFilter, search,
  onStatusChange, onCategoryChange, onBillingTypeChange, onSearchChange,
  onPageChange, onEdit, onDelete, onView,
}) => (
  <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col">
    {/* ── Billing Type Tabs ── */}
    <div className="px-5 pt-5 border-b border-slate-700/50">
      <div className="flex gap-1 overflow-x-auto pb-0">
        {BILLING_TABS.map(tab => {
          const active = billingTypeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onBillingTypeChange(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                active
                  ? tab.key === 'Termin'
                    ? 'border-purple-400 text-purple-300'
                    : tab.key === 'Sewa'
                    ? 'border-blue-400 text-blue-300'
                    : 'border-white text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>

    {/* ── Toolbar ── */}
    <div className="p-5 border-b border-slate-700/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari proyek atau klien…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value)}
          className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s === 'Semua' ? 'Semua Status' : s}</option>)}
        </select>
        <select
          value={categoryFilter}
          onChange={e => onCategoryChange(e.target.value)}
          className="bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'Semua' ? 'Semua Kategori' : c}</option>)}
        </select>
      </div>
    </div>

    {/* ── Table ── */}
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left table-fixed">
        <colgroup>
          <col className="w-[26%]" />  {/* Proyek */}
          <col className="w-[15%]" />  {/* Kategori */}
          <col className="w-[16%]" />  {/* Klien */}
          <col className="w-[13%]" />  {/* Status */}
          <col className="w-[12%]" />  {/* Deadline */}
          <col className="w-[12%]" />  {/* Nilai */}
          <col className="w-[6%]"  />  {/* Aksi */}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-700/50">
            {[
              { label: 'Proyek'   },
              { label: 'Kategori' },
              { label: 'Klien'    },
              { label: 'Status'   },
              { label: 'Deadline' },
              { label: 'Nilai', right: true },
              { label: 'Aksi',  center: true },
            ].map(h => (
              <th
                key={h.label}
                className={`px-4 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${h.right ? 'text-right' : h.center ? 'text-center' : ''}`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            SKELETON.map((_, i) => (
              <tr key={i} className="border-b border-slate-700/30">
                {Array.from({ length: 7 }).map((__, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse" style={{ width: j === 0 ? '80%' : j === 5 ? '60%' : '70%' }} />
                  </td>
                ))}
              </tr>
            ))
          ) : collection.projects.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Icon name="folder" className="w-12 h-12 text-slate-600" />
                  <p className="text-slate-400 font-medium">Tidak ada proyek ditemukan</p>
                  <p className="text-slate-500 text-sm">Coba ubah filter atau tambah proyek baru.</p>
                </div>
              </td>
            </tr>
          ) : (
            collection.projects.map(p => (
              <ProjectTableRow
                key={p.id}
                project={p}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* ── Pagination ── */}
    {!loading && collection.projects.length > 0 && (
      <div className="p-4 border-t border-slate-700/50">
        <Pagination
          page={collection.pagination.currentPage}
          totalPages={collection.pagination.totalPages}
          total={collection.pagination.totalProjects}
          limit={collection.pagination.perPage}
          onPageChange={onPageChange}
        />
      </div>
    )}
  </div>
);
