/**
 * Organism: ProjectTable
 * Full table listing projects with filters, search, loading skeleton, pagination.
 */
"use client";
import React from "react";
import {
  Project,
  ProjectCollection,
  ProjectCategory,
  ProjectStatus,
} from "@/src/domain/entities/Project";
import { ProjectTableRow } from "../../molecules/project/ProjectTableRow";
import { Pagination } from "../../molecules/shared/Pagination";
import { Icon } from "../../atoms/Icon";

const STATUSES: (ProjectStatus | "Semua")[] = [
  "Semua",
  "Baru",
  "Pending",
  "Proses",
  "Selesai",
  "Dibayar",
  "Dibatalkan",
];
const CATEGORIES: (ProjectCategory | "Semua")[] = [
  "Semua",
  "Pengadaan Barang",
  "Pengadaan Jasa",
  "Pengadaan ATK",
  "Pengadaan Komputer",
  "Pengadaan Furniture",
  "Lainnya",
];

type BillingTab = "Semua" | "Reguler" | "Termin" | "Sewa";
const BILLING_TABS: {
  key: BillingTab;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    key: "Semua",
    label: "Semua",
    icon: "/icons/iconsemua.svg",
    color: "text-slate-300 border-slate-400",
  },
  {
    key: "Reguler",
    label: "Langsung Bayar",
    icon: "/icons/iconlangsungbayar.svg",
    color: "text-slate-300 border-slate-400",
  },
  {
    key: "Termin",
    label: "Termin",
    icon: "/icons/icontermin.svg",
    color: "text-slate-300 border-slate-400",
  },
  {
    key: "Sewa",
    label: "Sewa",
    icon: "/icons/iconsewa.svg",
    color: "text-slate-300 border-slate-400",
  },
];

interface Props {
  collection: ProjectCollection;
  loading: boolean;
  statusFilter: string;
  categoryFilter: string;
  billingTypeFilter: string;
  search: string;
  onStatusChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onBillingTypeChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
  onView: (p: Project) => void;
}

const SKELETON = Array.from({ length: 5 });

/** Sidebar-style custom select dropdown */
interface SelectOption { value: string; label: string }
interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
  placeholder?: string;
}
const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
          open
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            : 'text-slate-400 hover:bg-slate-800/80 hover:text-white border-slate-700/50'
        }`}
      >
        <span className="whitespace-nowrap">{selected?.label}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} className="w-3.5 h-3.5 shrink-0" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[10rem] bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl z-50 py-1">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 text-sm transition-all duration-150 ${
                value === opt.value
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectTable: React.FC<Props> = ({
  collection,
  loading,
  statusFilter,
  categoryFilter,
  billingTypeFilter,
  search,
  onStatusChange,
  onCategoryChange,
  onBillingTypeChange,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}) => (
  <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col">
    {/* ── Billing Type Tabs ── */}
    <div className="px-5 pt-5 border-b border-slate-700/50">
      <div className="flex gap-1 overflow-x-auto pb-0">
        {BILLING_TABS.map((tab) => {
          const active = billingTypeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onBillingTypeChange(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                active
                  ? tab.key === "Termin"
                    ? "border-slate-400 text-slate-300"
                    : tab.key === "Sewa"
                      ? "border-slate-400 text-slate-300"
                      : "border-white text-white"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.icon.startsWith("/") ? (
                <img src={tab.icon} alt="" className="w-4 h-4" />
              ) : (
                <span>{tab.icon}</span>
              )}
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
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Cari proyek atau klien…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <CustomSelect
          value={statusFilter}
          onChange={onStatusChange}
          options={STATUSES.map(s => ({ value: s, label: s === 'Semua' ? 'Semua Status' : s }))}
        />
        <CustomSelect
          value={categoryFilter}
          onChange={onCategoryChange}
          options={CATEGORIES.map(c => ({ value: c, label: c === 'Semua' ? 'Semua Kategori' : c }))}
        />
      </div>
    </div>

    {/* ── Table ── */}
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left table-fixed">
        <colgroup>
          <col className="w-[26%]" /> {/* Proyek */}
          <col className="w-[15%]" /> {/* Kategori */}
          <col className="w-[16%]" /> {/* Klien */}
          <col className="w-[13%]" /> {/* Status */}
          <col className="w-[12%]" /> {/* Deadline */}
          <col className="w-[12%]" /> {/* Nilai */}
          <col className="w-[6%]" /> {/* Aksi */}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-700/50">
            {[
              { label: "Proyek" },
              { label: "Kategori" },
              { label: "Klien" },
              { label: "Status" },
              { label: "Deadline" },
              { label: "Nilai", right: true },
              { label: "Aksi", center: true },
            ].map((h) => (
              <th
                key={h.label}
                className={`px-4 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${h.right ? "text-right" : h.center ? "text-center" : ""}`}
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
                    <div
                      className="h-4 bg-slate-700/50 rounded animate-pulse"
                      style={{
                        width: j === 0 ? "80%" : j === 5 ? "60%" : "70%",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : collection.projects.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Icon name="folder" className="w-12 h-12 text-slate-600" />
                  <p className="text-slate-400 font-medium">
                    Tidak ada proyek ditemukan
                  </p>
                  <p className="text-slate-500 text-sm">
                    Coba ubah filter atau tambah proyek baru.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            collection.projects.map((p) => (
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
