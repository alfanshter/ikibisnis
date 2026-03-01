/**
 * Template: DailyReportTemplate
 * Layout for /finance/harian — Laporan Harian page.
 */
'use client';
import React from 'react';
import { Sidebar } from '@/src/presentation/components/organisms/Sidebar';
import { TopBar } from '@/src/presentation/components/organisms/TopBar';
import { FinanceSummaryCard } from '@/src/presentation/components/molecules/FinanceSummaryCard';
import { DailyReportTable } from '@/src/presentation/components/organisms/DailyReportTable';
import { TransactionModal } from '@/src/presentation/components/organisms/TransactionModal';
import { DailyReportResult, Transaction, CreateTransactionDTO, formatCurrencyIdr } from '@/src/domain/entities/Finance';

interface Props {
  result:              DailyReportResult;
  loading:             boolean;
  saving:              boolean;
  showModal:           boolean;
  dateFrom:            string;
  dateTo:              string;
  onDateChange:        (from: string, to: string) => void;
  onPageChange:        (page: number) => void;
  onOpenModal:         () => void;
  onCloseModal:        () => void;
  onAddTransaction:    (dto: CreateTransactionDTO) => void;
  onDeleteTransaction: (tx: Transaction) => void;
}

export const DailyReportTemplate: React.FC<Props> = ({
  result, loading, saving, showModal,
  dateFrom, dateTo,
  onDateChange, onPageChange,
  onOpenModal, onCloseModal,
  onAddTransaction, onDeleteTransaction,
}) => (
  <div className="flex min-h-screen bg-slate-950">
    <Sidebar />

    <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8 overflow-y-auto">
      <TopBar title="Laporan Harian" subtitle="Ringkasan transaksi pemasukan & pengeluaran harian." />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <FinanceSummaryCard
          label="Total Pemasukan"
          value={formatCurrencyIdr(result.totalPemasukan)}
          icon="trending-up"
          trend="up"
          sub="Rentang yang dipilih"
        />
        <FinanceSummaryCard
          label="Total Pengeluaran"
          value={formatCurrencyIdr(result.totalPengeluaran)}
          icon="trending-down"
          trend="down"
          sub="Rentang yang dipilih"
        />
        <FinanceSummaryCard
          label="Arus Kas Bersih"
          value={formatCurrencyIdr(result.netCashFlow)}
          icon="water"
          trend={result.netCashFlow >= 0 ? 'up' : 'down'}
          sub="Pemasukan - Pengeluaran"
        />
      </div>

      {/* Table */}
      <DailyReportTable
        result={result}
        loading={loading}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={onDateChange}
        onPageChange={onPageChange}
        onAddTransaction={onOpenModal}
        onDeleteTransaction={onDeleteTransaction}
      />
    </main>

    {/* Modal */}
    {showModal && (
      <TransactionModal
        saving={saving}
        onClose={onCloseModal}
        onSubmit={onAddTransaction}
      />
    )}
  </div>
);
