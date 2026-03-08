/**
 * Hook: useDebt
 * Full CRUD + pay operations for Hutang & Piutang.
 * Uses DI container use-cases → DebtRepository (dummy in-memory).
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Debt,
  DebtCollection,
  DebtSummary,
  CreateDebtDTO,
  UpdateDebtDTO,
  PayDebtDTO,
  GetDebtsQuery,
  DebtType,
} from '@/src/domain/entities/Finance';
import DIContainer from '@/src/infrastructure/di/container';

export interface DebtToastState { msg: string; type: 'success' | 'error' }

const container = DIContainer.getInstance();

export const useDebt = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [collection,    setCollection]    = useState<DebtCollection | null>(null);
  const [summary,       setSummary]       = useState<DebtSummary | null>(null);
  const [listLoading,   setListLoading]   = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState<DebtToastState | null>(null);
  const [query,         setQuery]         = useState<GetDebtsQuery>({ page: 1, limit: 20 });

  // ── Modal state ───────────────────────────────────────────────────────────
  const [showCreateModal,   setShowCreateModal]   = useState(false);
  const [showEditModal,     setShowEditModal]      = useState(false);
  const [showPayModal,      setShowPayModal]       = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm]  = useState(false);
  const [editingDebt,       setEditingDebt]        = useState<Debt | null>(null);
  const [payingDebt,        setPayingDebt]         = useState<Debt | null>(null);
  const [deletingDebt,      setDeletingDebt]       = useState<Debt | null>(null);

  const isMounted = useRef(true);
  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string, type: DebtToastState['type'] = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch list ─────────────────────────────────────────────────────────────
  const fetchDebts = useCallback(async (q: GetDebtsQuery) => {
    setListLoading(true);
    try {
      const data = await container.getGetDebtsUseCase().execute(q);
      if (isMounted.current) setCollection(data);
    } catch (err) {
      if (isMounted.current) showToast((err as Error).message, 'error');
    } finally {
      if (isMounted.current) setListLoading(false);
    }
  }, [showToast]);

  // ── Fetch summary ──────────────────────────────────────────────────────────
  const fetchSummary = useCallback(async () => {
    try {
      const data = await container.getGetDebtSummaryUseCase().execute();
      if (isMounted.current) setSummary(data);
    } catch { /* non-blocking */ }
  }, []);

  useEffect(() => {
    fetchDebts(query);
    fetchSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleCreate = useCallback(async (dto: CreateDebtDTO) => {
    setSaving(true);
    try {
      await container.getCreateDebtUseCase().execute(dto);
      showToast(`${dto.type === 'hutang' ? 'Hutang' : 'Piutang'} berhasil ditambahkan`);
      setShowCreateModal(false);
      fetchDebts(query);
      fetchSummary();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [query, fetchDebts, fetchSummary, showToast]);

  // ── Update ─────────────────────────────────────────────────────────────────
  const handleUpdate = useCallback(async (id: string, dto: UpdateDebtDTO) => {
    setSaving(true);
    try {
      await container.getUpdateDebtUseCase().execute(id, dto);
      showToast('Data berhasil diperbarui');
      setShowEditModal(false);
      setEditingDebt(null);
      fetchDebts(query);
      fetchSummary();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [query, fetchDebts, fetchSummary, showToast]);

  // ── Pay ────────────────────────────────────────────────────────────────────
  const handlePay = useCallback(async (id: string, dto: PayDebtDTO) => {
    setSaving(true);
    try {
      await container.getPayDebtUseCase().execute(id, dto);
      showToast('Pembayaran berhasil dicatat');
      setShowPayModal(false);
      setPayingDebt(null);
      fetchDebts(query);
      fetchSummary();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [query, fetchDebts, fetchSummary, showToast]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!deletingDebt) return;
    setSaving(true);
    try {
      await container.getDeleteDebtUseCase().execute(deletingDebt.id);
      showToast('Data berhasil dihapus');
      setShowDeleteConfirm(false);
      setDeletingDebt(null);
      fetchDebts(query);
      fetchSummary();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [deletingDebt, query, fetchDebts, fetchSummary, showToast]);

  // ── Filter helpers ─────────────────────────────────────────────────────────
  const setTypeFilter   = (type: DebtType | undefined)          => setQuery(prev => ({ ...prev, page: 1, type }));
  const setSearchFilter = (search: string)                       => setQuery(prev => ({ ...prev, page: 1, search: search || undefined }));
  const setStatusFilter = (status: GetDebtsQuery['status'])      => setQuery(prev => ({ ...prev, page: 1, status }));
  const setPage         = (page: number)                         => setQuery(prev => ({ ...prev, page }));

  return {
    // Data
    collection, summary, query,
    // Loading
    listLoading, saving,
    // Toast
    toast,
    // Modal state
    showCreateModal, showEditModal, showPayModal, showDeleteConfirm,
    editingDebt, payingDebt, deletingDebt,
    // Modal openers
    openCreate:  ()        => setShowCreateModal(true),
    closeCreate: ()        => setShowCreateModal(false),
    openEdit:    (d: Debt) => { setEditingDebt(d);  setShowEditModal(true);  },
    closeEdit:   ()        => { setShowEditModal(false);  setEditingDebt(null);  },
    openPay:     (d: Debt) => { setPayingDebt(d);   setShowPayModal(true);   },
    closePay:    ()        => { setShowPayModal(false);   setPayingDebt(null);   },
    openDelete:  (d: Debt) => { setDeletingDebt(d); setShowDeleteConfirm(true); },
    closeDelete: ()        => { setShowDeleteConfirm(false); setDeletingDebt(null); },
    // Actions
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onPay:    handlePay,
    onDelete: handleDelete,
    // Filters
    setTypeFilter, setSearchFilter, setStatusFilter, setPage,
    refresh: () => { fetchDebts(query); fetchSummary(); },
  };
};
