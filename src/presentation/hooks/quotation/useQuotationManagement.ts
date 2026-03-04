/**
 * Hook: useQuotationManagement
 * State + side-effects untuk halaman /projects/quotations.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DIContainer from '@/src/infrastructure/di/container';
import {
  Quotation,
  QuotationCollection,
  QuotationStats,
  CreateQuotationDTO,
  UpdateQuotationDTO,
  AccQuotationDTO,
  RejectQuotationDTO,
} from '@/src/domain/entities/Quotation';

const PER_PAGE = 10;

export function useQuotationManagement() {
  const router   = useRouter();
  const container = DIContainer.getInstance();

  // ── List state ──────────────────────────────────────────────────────────
  const [collection,    setCollection]    = useState<QuotationCollection | null>(null);
  const [stats,         setStats]         = useState<QuotationStats | null>(null);
  const [tableLoading,  setTableLoading]  = useState(true);
  const [page,          setPage]          = useState(1);
  const [statusFilter,  setStatusFilter]  = useState('Semua');
  const [search,        setSearch]        = useState('');

  // ── Modal / action state ────────────────────────────────────────────────
  const [showAddModal,      setShowAddModal]      = useState(false);
  const [editingQuotation,  setEditingQuotation]  = useState<Quotation | null>(null);
  const [deletingQuotation, setDeletingQuotation] = useState<Quotation | null>(null);
  const [accingQuotation,   setAccingQuotation]   = useState<Quotation | null>(null);
  const [rejectingQuotation,setRejectingQuotation]= useState<Quotation | null>(null);
  const [convertingQuotation,setConvertingQuotation]= useState<Quotation | null>(null);

  const [modalSaving,  setModalSaving]  = useState(false);
  const [actionSaving, setActionSaving] = useState(false);
  const [deleting,     setDeleting]     = useState(false);

  // ── Loaders ─────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setTableLoading(true);
    try {
      const [col, st] = await Promise.all([
        container.getGetQuotationsUseCase().execute(page, PER_PAGE, statusFilter, search),
        container.getGetQuotationStatsUseCase().execute(),
      ]);
      setCollection(col);
      setStats(st);
    } finally {
      setTableLoading(false);
    }
  }, [container, page, statusFilter, search]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handlePageChange     = (p: number) => setPage(p);
  const handleStatusFilter   = (v: string) => { setStatusFilter(v); setPage(1); };
  const handleSearch         = (v: string) => { setSearch(v); setPage(1); };
  const handleOpenAddModal   = () => setShowAddModal(true);
  const handleCloseAddModal  = () => { setShowAddModal(false); setEditingQuotation(null); };
  const handleEditQuotation  = (q: Quotation) => setEditingQuotation(q);
  const handleDeleteQuotation = (q: Quotation) => setDeletingQuotation(q);

  const handleAccQuotation    = (q: Quotation) => setAccingQuotation(q);
  const handleRejectQuotation = (q: Quotation) => setRejectingQuotation(q);
  const handleConvertQuotation = (q: Quotation) => setConvertingQuotation(q);

  const handleModalSubmit = async (dto: CreateQuotationDTO | UpdateQuotationDTO) => {
    setModalSaving(true);
    try {
      if ('id' in dto) {
        await container.getUpdateQuotationUseCase().execute(dto as UpdateQuotationDTO);
      } else {
        await container.getCreateQuotationUseCase().execute(dto as CreateQuotationDTO);
      }
      handleCloseAddModal();
      await loadData();
    } finally {
      setModalSaving(false);
    }
  };

  const handleSendQuotation = async (q: Quotation) => {
    setActionSaving(true);
    try {
      await container.getSendQuotationUseCase().execute(q.id);
      await loadData();
    } finally {
      setActionSaving(false);
    }
  };

  const handleAccSubmit = async (dto: AccQuotationDTO) => {
    setActionSaving(true);
    try {
      await container.getAccQuotationUseCase().execute(dto);
      setAccingQuotation(null);
      await loadData();
    } finally {
      setActionSaving(false);
    }
  };

  const handleRejectSubmit = async (dto: RejectQuotationDTO) => {
    setActionSaving(true);
    try {
      await container.getRejectQuotationUseCase().execute(dto);
      setRejectingQuotation(null);
      await loadData();
    } finally {
      setActionSaving(false);
    }
  };

  const handleConvertSubmit = async (quotationId: string, deadline: Date) => {
    setActionSaving(true);
    try {
      const project = await container.getConvertToProjectUseCase().execute(quotationId, deadline);
      setConvertingQuotation(null);
      await loadData();
      router.push(`/projects/${project.id}`);
    } finally {
      setActionSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingQuotation) return;
    setDeleting(true);
    try {
      await container.getDeleteQuotationUseCase().execute(deletingQuotation.id);
      setDeletingQuotation(null);
      await loadData();
    } finally {
      setDeleting(false);
    }
  };

  return {
    // data
    collection, stats,
    // flags
    tableLoading, modalSaving, actionSaving, deleting,
    // modal state
    showAddModal, editingQuotation, deletingQuotation,
    accingQuotation, rejectingQuotation, convertingQuotation,
    // filters
    statusFilter, search, page,
    // callbacks
    onPageChange:        handlePageChange,
    onStatusFilter:      handleStatusFilter,
    onSearch:            handleSearch,
    onOpenAddModal:      handleOpenAddModal,
    onCloseModal:        handleCloseAddModal,
    onEditQuotation:     handleEditQuotation,
    onDeleteQuotation:   handleDeleteQuotation,
    onAccQuotation:      handleAccQuotation,
    onRejectQuotation:   handleRejectQuotation,
    onConvertQuotation:  handleConvertQuotation,
    onModalSubmit:       handleModalSubmit,
    onSendQuotation:     handleSendQuotation,
    onAccSubmit:         handleAccSubmit,
    onRejectSubmit:      handleRejectSubmit,
    onConvertSubmit:     handleConvertSubmit,
    onDeleteConfirm:     handleDeleteConfirm,
    onDeleteClose:       () => setDeletingQuotation(null),
    onAccClose:          () => setAccingQuotation(null),
    onRejectClose:       () => setRejectingQuotation(null),
    onConvertClose:      () => setConvertingQuotation(null),
  };
}
