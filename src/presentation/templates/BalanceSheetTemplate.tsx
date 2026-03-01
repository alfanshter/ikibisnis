/**
 * Template: BalanceSheetTemplate
 * Layout for /finance/neraca — Neraca page.
 */
'use client';
import React from 'react';
import { Sidebar } from '@/src/presentation/components/organisms/Sidebar';
import { FinanceSummaryCard } from '@/src/presentation/components/molecules/FinanceSummaryCard';
import { BalanceSheetTable } from '@/src/presentation/components/organisms/BalanceSheetTable';
import { BalanceSheet, formatCurrencyIdr } from '@/src/domain/entities/Finance';

interface Props {
  data:           BalanceSheet;
  loading:        boolean;
  period:         string;
  onPeriodChange: (p: string) => void;
}

export const BalanceSheetTemplate: React.FC<Props> = ({ data, loading, period, onPeriodChange }) => (
  <div className="flex min-h-screen bg-slate-950">
    <Sidebar />

    <main className="flex-1 ml-64 p-8 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-slate-500 text-sm mb-1">Finance / Neraca</p>
        <h1 className="text-white text-2xl font-bold tracking-tight">Neraca (Balance Sheet)</h1>
      </div>

      {/* Summary Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <FinanceSummaryCard
            label="Total Aktiva"
            value={formatCurrencyIdr(data.totalAssets)}
            icon="bank"
            trend="up"
            sub={data.period}
          />
          <FinanceSummaryCard
            label="Total Kewajiban"
            value={formatCurrencyIdr(data.totalLiabilities)}
            icon="trending-down"
            trend="down"
            sub={data.period}
          />
          <FinanceSummaryCard
            label="Total Ekuitas"
            value={formatCurrencyIdr(data.totalEquity)}
            icon="scale"
            trend="up"
            sub={data.period}
          />
        </div>
      )}

      {/* Balance Sheet Table */}
      <BalanceSheetTable
        data={data}
        loading={loading}
        period={period}
        onPeriodChange={onPeriodChange}
      />
    </main>
  </div>
);
