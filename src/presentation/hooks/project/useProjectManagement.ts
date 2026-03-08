/**
 * Custom Hook: useProjectManagement
 * All state + side-effects for the Project Management page.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Project,
  ProjectCollection,
  ProjectStats,
  CreateProjectDTO,
  UpdateProjectDTO
} from '@/src/domain/entities/Project';
import DIContainer from '@/src/infrastructure/di/container';

const DEFAULT_COLLECTION = new ProjectCollection(
  [],
  { currentPage: 1, totalPages: 1, totalProjects: 0, perPage: 6 }
);

export const useProjectManagement = () => {
  const router = useRouter();

  /* ── Data ── */
  const [collection,     setCollection]     = useState<ProjectCollection>(DEFAULT_COLLECTION);
  const [stats,          setStats]          = useState<ProjectStats | null>(null);

  /* ── Flags ── */
  const [tableLoading, setTableLoading] = useState(true);
  const [modalSaving,  setModalSaving]  = useState(false);
  const [deleting,     setDeleting]     = useState(false);

  /* ── Modal state ── */
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [editingProject,  setEditingProject]  = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  /* ── Filters ── */
  const [page,               setPage]               = useState(1);
  const [statusFilter,       setStatusFilter]       = useState('Semua');
  const [categoryFilter,     setCategoryFilter]     = useState('Semua');
  const [billingTypeFilter,  setBillingTypeFilter]  = useState('Semua');
  const [search,             setSearch]             = useState('');

  const container = DIContainer.getInstance();

  /* ── Load projects ── */
  const loadProjects = useCallback(async (p: number, sf: string, cf: string, q: string, bf: string) => {
    try {
      setTableLoading(true);
      const data = await container.getGetProjectsUseCase().execute(p, 6, sf, cf, q, bf);
      setCollection(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setTableLoading(false);
    }
  }, [container]);

  const loadStats = useCallback(async () => {
    try {
      const s = await container.getGetProjectStatsUseCase().execute();
      setStats(s);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, [container]);

  useEffect(() => { loadProjects(page, statusFilter, categoryFilter, search, billingTypeFilter); }, [page, statusFilter, categoryFilter, search, billingTypeFilter, loadProjects]);
  useEffect(() => { loadStats(); }, [loadStats]);

  /* ── Filters + Pagination ── */
  const handlePageChange         = (p: number) => setPage(p);
  const handleStatusFilter       = (v: string) => { setStatusFilter(v);      setPage(1); };
  const handleCategoryFilter     = (v: string) => { setCategoryFilter(v);    setPage(1); };
  const handleBillingTypeFilter  = (v: string) => { setBillingTypeFilter(v); setPage(1); };
  const handleSearch             = (v: string) => { setSearch(v);            setPage(1); };

  /* ── Add / Edit ── */
  const handleAddProject  = () => { setEditingProject(null); setShowAddModal(true); };
  const handleEditProject = (p: Project) => { setShowAddModal(false); setEditingProject(p); };
  const handleModalClose  = () => { setShowAddModal(false); setEditingProject(null); };

  const handleModalSubmit = async (dto: CreateProjectDTO | UpdateProjectDTO) => {
    try {
      setModalSaving(true);
      if (!('id' in dto)) {
        await container.getCreateProjectUseCase().execute(dto as CreateProjectDTO);
      } else {
        await container.getUpdateProjectUseCase().execute(dto as UpdateProjectDTO);
      }
      handleModalClose();
      await Promise.all([loadProjects(page, statusFilter, categoryFilter, search, billingTypeFilter), loadStats()]);
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setModalSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDeleteProject = (p: Project) => setDeletingProject(p);
  const handleDeleteClose   = () => setDeletingProject(null);

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    try {
      setDeleting(true);
      await container.getDeleteProjectUseCase().execute(deletingProject.id);
      setDeletingProject(null);
      const newPage = collection.projects.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      await Promise.all([loadProjects(newPage, statusFilter, categoryFilter, search, billingTypeFilter), loadStats()]);
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeleting(false);
    }
  };

  /* ── View: navigate to detail page ── */
  const handleViewProject = (p: Project) => router.push(`/projects/${p.id}`);

  return {
    collection, stats,
    tableLoading, modalSaving, deleting,
    showAddModal, editingProject, deletingProject,
    statusFilter, categoryFilter, billingTypeFilter, search,
    handlePageChange, handleStatusFilter, handleCategoryFilter, handleBillingTypeFilter, handleSearch,
    handleAddProject, handleEditProject, handleDeleteProject, handleViewProject,
    handleModalClose, handleModalSubmit,
    handleDeleteConfirm, handleDeleteClose,
  };
};
