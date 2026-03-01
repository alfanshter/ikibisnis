/**
 * Hook: useFinanceHarian
 * State + data for Laporan Harian page.
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import DIContainer from '@/src/infrastructure/di/container';
import { DailyReportResult, Transaction, CreateTransactionDTO } from '@/src/domain/entities/Finance';

const fmt = (d: Date) => d.toISOString().slice(0, 10);

const defaultResult = (): DailyReportResult => ({
  reports: [], pagination: { currentPage: 1, totalPages: 1, totalRecords: 0, perPage: 7 },
  totalPemasukan: 0, totalPengeluaran: 0, netCashFlow: 0,
});

const firstOfMonth = () => {
  const d = new Date();
  return fmt(new Date(d.getFullYear(), d.getMonth(), 1));
};
const lastOfMonth = () => {
  const d = new Date();
  return fmt(new Date(d.getFullYear(), d.getMonth() + 1, 0));
};

export const useFinanceHarian = () => {
  const container           = DIContainer.getInstance();
  const getDailyReport      = container.getGetDailyReportUseCase();
  const createTransaction   = container.getCreateTransactionUseCase();
  const deleteTransaction   = container.getDeleteTransactionUseCase();

  const [result,    setResult]    = useState<DailyReportResult>(defaultResult());
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dateFrom,  setDateFrom]  = useState(firstOfMonth());
  const [dateTo,    setDateTo]    = useState(lastOfMonth());
  const [page,      setPage]      = useState(1);

  const loadData = useCallback(async (from: string, to: string, p: number) => {
    setLoading(true);
    try {
      const data = await getDailyReport.execute(new Date(from), new Date(to), p, 7);
      setResult(data);
    } finally {
      setLoading(false);
    }
  }, [getDailyReport]);

  useEffect(() => { loadData(dateFrom, dateTo, page); }, [dateFrom, dateTo, page, loadData]);

  const handleDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
    setPage(1);
  };

  const handlePageChange = (p: number) => setPage(p);

  const handleAddTransaction = async (dto: CreateTransactionDTO) => {
    setSaving(true);
    try {
      await createTransaction.execute(dto);
      setShowModal(false);
      await loadData(dateFrom, dateTo, page);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTransaction = async (tx: Transaction) => {
    await deleteTransaction.execute(tx.id);
    await loadData(dateFrom, dateTo, page);
  };

  return {
    result, loading, saving, showModal,
    dateFrom, dateTo,
    onDateChange:        handleDateChange,
    onPageChange:        handlePageChange,
    onOpenModal:         () => setShowModal(true),
    onCloseModal:        () => setShowModal(false),
    onAddTransaction:    handleAddTransaction,
    onDeleteTransaction: handleDeleteTransaction,
  };
};
