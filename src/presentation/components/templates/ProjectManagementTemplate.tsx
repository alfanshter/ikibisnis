/**
 * Template: ProjectManagementTemplate
 * Composes all project-management organisms into a complete page layout.
 * Pure presentation — receives all state + callbacks as props.
 */
'use client';
import React from 'react';
import {
  Project,
  ProjectCollection,
  ProjectStats,
  ProjectStatus,
  CreateProjectDTO,
  UpdateProjectDTO,
} from '@/src/domain/entities/Project';
import { Sidebar } from '../organisms/Sidebar';
import { ProjectTable } from '../organisms/ProjectTable';
import { ProjectModal } from '../organisms/ProjectModal';
import { DeleteProjectModal } from '../organisms/DeleteProjectModal';
import { ProjectDetailPanel } from '../organisms/ProjectDetailPanel';
import { ProjectStatsCard } from '../molecules/ProjectStatsCard';
import { Icon } from '../atoms/Icon';
import { formatCurrency } from '@/src/domain/entities/Project';

export interface ProjectManagementTemplateProps {
  /* Data */
  collection:    ProjectCollection;
  stats:         ProjectStats | null;
  viewingProject: Project | null;

  /* Flags */
  tableLoading:  boolean;
  modalSaving:   boolean;
  deleting:      boolean;
  panelSaving:   boolean;

  /* Modal state */
  showAddModal:  boolean;
  editingProject: Project | null;
  deletingProject: Project | null;

  /* Filters */
  statusFilter:   string;
  categoryFilter: string;
  search:         string;

  /* Callbacks */
  onPageChange:      (page: number)  => void;
  onStatusFilter:    (v: string)     => void;
  onCategoryFilter:  (v: string)     => void;
  onSearch:          (v: string)     => void;
  onAddProject:      ()              => void;
  onEditProject:     (p: Project)    => void;
  onDeleteProject:   (p: Project)    => void;
  onViewProject:     (p: Project)    => void;
  onModalClose:      ()              => void;
  onModalSubmit:     (dto: CreateProjectDTO | UpdateProjectDTO) => Promise<void>;
  onDeleteConfirm:   ()              => Promise<void>;
  onDeleteClose:     ()              => void;
  onDetailClose:     ()              => void;
  onDetailEdit:      ()              => void;
  onStatusChange:    (status: ProjectStatus) => void;
}

export const ProjectManagementTemplate: React.FC<ProjectManagementTemplateProps> = ({
  collection, stats, viewingProject,
  tableLoading, modalSaving, deleting, panelSaving,
  showAddModal, editingProject, deletingProject,
  statusFilter, categoryFilter, search,
  onPageChange, onStatusFilter, onCategoryFilter, onSearch,
  onAddProject, onEditProject, onDeleteProject, onViewProject,
  onModalClose, onModalSubmit,
  onDeleteConfirm, onDeleteClose,
  onDetailClose, onDetailEdit, onStatusChange,
}) => (
  <div className="flex min-h-screen bg-slate-900">
    <Sidebar activePage="Projects" />

    <main className="flex-1 ml-64 flex flex-col min-h-screen">
      {/* ── Page Header ── */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Manajemen Proyek</h1>
            <p className="text-slate-400 text-sm mt-1">Track record semua job & pengadaan masuk</p>
          </div>
          <button
            onClick={onAddProject}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            <Icon name="plus" className="w-4 h-4" />
            Tambah Proyek
          </button>
        </div>

        {/* ── Stats Bar ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            <ProjectStatsCard label="Total Proyek" value={stats.total}       icon="briefcase"    color="blue"    />
            <ProjectStatsCard label="Baru"          value={stats.baru}        icon="alert-circle" color="sky"     />
            <ProjectStatsCard label="Sedang Proses" value={stats.proses}      icon="clock"        color="amber"   />
            <ProjectStatsCard label="Selesai"        value={stats.selesai}     icon="check-circle" color="emerald" />
            <ProjectStatsCard label="Dibatalkan"     value={stats.dibatalkan}  icon="x"            color="red"     />
            <ProjectStatsCard
              label="Total Nilai"
              value={formatCurrency(stats.totalValue)}
              icon="dollar-sign"
              color="purple"
              sub="Ekskl. dibatalkan"
            />
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 gap-0 px-8 pb-8">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <ProjectTable
            collection={collection}
            loading={tableLoading}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            search={search}
            onStatusChange={onStatusFilter}
            onCategoryChange={onCategoryFilter}
            onSearchChange={onSearch}
            onPageChange={onPageChange}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            onView={onViewProject}
          />
        </div>

        {/* Detail Panel */}
        {viewingProject && (
          <div className="ml-4">
            <ProjectDetailPanel
              project={viewingProject}
              saving={panelSaving}
              onClose={onDetailClose}
              onEdit={onDetailEdit}
              onStatusChange={onStatusChange}
            />
          </div>
        )}
      </div>
    </main>

    {/* ── Modals ── */}
    {(showAddModal || editingProject) && (
      <ProjectModal
        mode={showAddModal ? 'add' : 'edit'}
        project={editingProject}
        saving={modalSaving}
        onClose={onModalClose}
        onSubmit={onModalSubmit}
      />
    )}

    {deletingProject && (
      <DeleteProjectModal
        project={deletingProject}
        deleting={deleting}
        onConfirm={onDeleteConfirm}
        onClose={onDeleteClose}
      />
    )}
  </div>
);
