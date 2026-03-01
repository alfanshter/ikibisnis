/**
 * Custom Hook: useProjectManagement
 * All state + side-effects for the Project Management page.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Project,
  ProjectCollection,
  ProjectStats,
  ProjectStatus,
  CreateProjectDTO,
  UpdateProjectDTO
} from '@/src/domain/entities/Project';
import DIContainer from '@/src/infrastructure/di/container';

const DEFAULT_COLLECTION = new ProjectCollection(
  [],
  { currentPage: 1, totalPages: 1, totalProjects: 0, perPage: 6 }
);

export const useProjectManagement = () => {
  /* ── Data ── */
  const [collection,     setCollection]     = useState<ProjectCollection>(DEFAULT_COLLECTION);
  const [stats,          setStats]          = useState<ProjectStats | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  /* ── Flags ── */
  const [tableLoading, setTableLoading] = useState(true);
  const [modalSaving,  setModalSaving]  = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [panelSaving,  setPanelSaving]  = useState(false);

  /* ── Modal state ── */
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [editingProject,  setEditingProject]  = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  /* ── Filters ── */
  const [page,           setPage]           = useState(1);
  const [statusFilter,   setStatusFilter]   = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [search,         setSearch]         = useState('');

  const container = DIContainer.getInstance();

  /* ── Load projects ── */
  const loadProjects = useCallback(async (p: number, sf: string, cf: string, q: string) => {
    try {
      setTableLoading(true);
      const data = await container.getGetProjectsUseCase().execute(p, 6, sf, cf, q);
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

  useEffect(() => { loadProjects(page, statusFilter, categoryFilter, search); }, [page, statusFilter, categoryFilter, search, loadProjects]);
  useEffect(() => { loadStats(); }, [loadStats]);

  /* ── Filters + Pagination ── */
  const handlePageChange     = (p: number) => setPage(p);
  const handleStatusFilter   = (v: string) => { setStatusFilter(v);   setPage(1); };
  const handleCategoryFilter = (v: string) => { setCategoryFilter(v); setPage(1); };
  const handleSearch         = (v: string) => { setSearch(v);         setPage(1); };

  /* ── Add / Edit ── */
  const handleAddProject  = () => { setEditingProject(null); setShowAddModal(true); };
  const handleEditProject = (p: Project) => { setShowAddModal(false); setEditingProject(p); setViewingProject(null); };
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
      await Promise.all([loadProjects(page, statusFilter, categoryFilter, search), loadStats()]);
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
      if (viewingProject?.id === deletingProject.id) setViewingProject(null);
      setDeletingProject(null);
      const newPage = collection.projects.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      await Promise.all([loadProjects(newPage, statusFilter, categoryFilter, search), loadStats()]);
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeleting(false);
    }
  };

  /* ── Detail panel ── */
  const handleViewProject = (p: Project) => setViewingProject(p);
  const handleDetailClose = () => setViewingProject(null);
  const handleDetailEdit  = () => { if (viewingProject) handleEditProject(viewingProject); };

  const handleStatusChange = async (status: ProjectStatus) => {
    if (!viewingProject) return;
    try {
      setPanelSaving(true);
      await container.getUpdateProjectUseCase().execute({ id: viewingProject.id, status });
      const refreshed = await container.getGetProjectsUseCase().execute(page, 6, statusFilter, categoryFilter, search);
      setCollection(refreshed);
      const updated = refreshed.projects.find(p => p.id === viewingProject.id) ?? { ...viewingProject, status };
      setViewingProject(updated);
      await loadStats();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setPanelSaving(false);
    }
  };

  return {
    collection, stats, viewingProject,
    tableLoading, modalSaving, deleting, panelSaving,
    showAddModal, editingProject, deletingProject,
    statusFilter, categoryFilter, search,
    handlePageChange, handleStatusFilter, handleCategoryFilter, handleSearch,
    handleAddProject, handleEditProject, handleDeleteProject, handleViewProject,
    handleModalClose, handleModalSubmit,
    handleDeleteConfirm, handleDeleteClose,
    handleDetailClose, handleDetailEdit, handleStatusChange,
  };
};
