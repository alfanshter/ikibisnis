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
  CreateProjectDTO,
  UpdateProjectDTO,
} from '@/src/domain/entities/Project';
import { Sidebar } from '../organisms/Sidebar';
import { TopBar } from '../organisms/TopBar';
import { ProjectTable } from '../organisms/ProjectTable';
import { ProjectModal } from '../organisms/ProjectModal';
import { DeleteProjectModal } from '../organisms/DeleteProjectModal';
import { ProjectStatsCard } from '../molecules/ProjectStatsCard';
import { Icon } from '../atoms/Icon';

export interface ProjectManagementTemplateProps {
  /* Data */
  collection:    ProjectCollection;
  stats:         ProjectStats | null;

  /* Flags */
  tableLoading:  boolean;
  modalSaving:   boolean;
  deleting:      boolean;

  /* Modal state */
  showAddModal:    boolean;
  editingProject:  Project | null;
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
}

export const ProjectManagementTemplate: React.FC<ProjectManagementTemplateProps> = ({
  collection, stats,
  tableLoading, modalSaving, deleting,
  showAddModal, editingProject, deletingProject,
  statusFilter, categoryFilter, search,
  onPageChange, onStatusFilter, onCategoryFilter, onSearch,
  onAddProject, onEditProject, onDeleteProject, onViewProject,
  onModalClose, onModalSubmit,
  onDeleteConfirm, onDeleteClose,
}) => (
  <div className="flex min-h-screen bg-slate-900">
    <Sidebar activePage="Projects" />

    <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pt-16 lg:pt-0">
      {/* ── Page Header ── */}
      <div className="px-8 pt-8 pb-0">
        <TopBar
          title="Manajemen Proyek"
          subtitle="Track record semua job & pengadaan masuk"
          action={
            <button
              onClick={onAddProject}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              <Icon name="plus" className="w-4 h-4" />
              Tambah Proyek
            </button>
          }
        />

        {/* ── Stats Bar ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
            <ProjectStatsCard label="Total Proyek" value={stats.total}       icon="briefcase"    color="blue"    />
            <ProjectStatsCard label="Baru"          value={stats.baru}        icon="alert-circle" color="sky"     />
            <ProjectStatsCard label="Sedang Proses" value={stats.proses}      icon="clock"        color="amber"   />
            <ProjectStatsCard label="Selesai"        value={stats.selesai}     icon="check-circle" color="emerald" />
            <ProjectStatsCard label="Dibatalkan"     value={stats.dibatalkan}  icon="x"            color="red"     />
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 gap-0 px-8 pb-8">
        {/* Table — full width now that detail panel is a separate page */}
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
