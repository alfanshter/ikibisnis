/**
 * Hook: useProjectDetail
 * Loads a single project by ID and handles status changes + edit navigation.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectStatus, UpdateProjectDTO } from '@/src/domain/entities/Project';
import DIContainer from '@/src/infrastructure/di/container';

export const useProjectDetail = (id: string) => {
  const router = useRouter();
  const container = DIContainer.getInstance();

  const [project,  setProject]  = useState<Project | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await container.getGetProjectByIdUseCase().execute(id);
      if (!data) { setNotFound(true); return; }
      setProject(data);
    } catch (err) {
      console.error('Failed to load project:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id, container]);

  useEffect(() => { loadProject(); }, [loadProject]);

  const handleStatusChange = async (status: ProjectStatus) => {
    if (!project) return;
    try {
      setSaving(true);
      const dto: UpdateProjectDTO = { id: project.id, status };
      await container.getUpdateProjectUseCase().execute(dto);
      setProject(prev => prev ? { ...prev, status } : prev);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    // Navigate back to list with a query param so the edit modal opens
    router.push(`/projects?edit=${id}`);
  };

  return {
    project,
    loading,
    saving,
    notFound,
    onStatusChange: handleStatusChange,
    onEdit:         handleEdit,
  };
};
