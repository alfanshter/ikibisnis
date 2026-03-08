/**
 * Hook: useProjectDetail
 * Loads a single project by ID and handles status changes + edit navigation.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectStatus, UpdateProjectDTO, PayTerminDTO, PaymentMethod, Termin } from '@/src/domain/entities/Project';
import DIContainer from '@/src/infrastructure/di/container';

export const useProjectDetail = (id: string) => {
  const router = useRouter();
  const container = DIContainer.getInstance();

  const [project,            setProject]            = useState<Project | null>(null);
  const [loading,            setLoading]            = useState(true);
  const [saving,             setSaving]             = useState(false);
  const [notFound,           setNotFound]           = useState(false);
  const [showPaymentModal,   setShowPaymentModal]   = useState(false);
  const [pendingStatus,      setPendingStatus]      = useState<ProjectStatus | null>(null);
  const [showTerminModal,    setShowTerminModal]    = useState(false);
  const [selectedTermin,     setSelectedTermin]     = useState<Termin | null>(null);

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
    // 'Dibayar' needs payment details — open modal first
    if (status === 'Dibayar') {
      setPendingStatus('Dibayar');
      setShowPaymentModal(true);
      return;
    }
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

  /** Called when user confirms the payment modal (Reguler/Sewa). */
  const handleMarkAsPaid = async (
    paymentMethod: PaymentMethod,
    paymentNotes?: string,
  ) => {
    if (!project || !pendingStatus) return;
    try {
      setSaving(true);
      const dto: UpdateProjectDTO = {
        id:            project.id,
        status:        'Dibayar',
        paymentMethod,
        paymentNotes,
      };
      const updated = await container.getUpdateProjectUseCase().execute(dto);
      setProject(updated);
      setShowPaymentModal(false);
      setPendingStatus(null);
    } catch (err) {
      console.error('Failed to mark as paid:', err);
    } finally {
      setSaving(false);
    }
  };

  /** Open the termin payment modal for a specific termin. */
  const handleOpenTerminModal = (termin: Termin) => {
    setSelectedTermin(termin);
    setShowTerminModal(true);
  };

  /** Called when user confirms payment for one termin installment. */
  const handlePayTermin = async (
    paymentMethod: PaymentMethod,
    notes?: string,
  ) => {
    if (!project || !selectedTermin) return;
    try {
      setSaving(true);
      const dto: PayTerminDTO = {
        projectId:     project.id,
        terminId:      selectedTermin.id,
        paymentMethod,
        notes,
      };
      const updated = await container.getPayTerminUseCase().execute(dto);
      setProject(updated);
      setShowTerminModal(false);
      setSelectedTermin(null);
    } catch (err) {
      console.error('Failed to pay termin:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    router.push(`/projects?edit=${id}`);
  };

  return {
    project,
    loading,
    saving,
    notFound,
    showPaymentModal,
    showTerminModal,
    selectedTermin,
    onStatusChange:    handleStatusChange,
    onMarkAsPaid:      handleMarkAsPaid,
    onClosePayModal:   () => { setShowPaymentModal(false); setPendingStatus(null); },
    onOpenTerminModal: handleOpenTerminModal,
    onPayTermin:       handlePayTermin,
    onCloseTerminModal: () => { setShowTerminModal(false); setSelectedTermin(null); },
    onEdit:            handleEdit,
  };
};

