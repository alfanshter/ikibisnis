/**
 * Template: IncomeStatementTemplate
 * Layout for /finance/laba-rugi — Laba Rugi page.
 */
'use client';
import React from 'react';
import { Sidebar } from '@/src/presentation/components/organisms/Sidebar';
import { FinanceSummaryCard } from '@/src/presentation/components/molecules/FinanceSummaryCard';
import { IncomeStatementTable } from '@/src/presentation/components/organisms/IncomeStatementTable';
import { IncomeStatement, formatCurrencyIdr } from '@/src/domain/entities/Finance';

interface Props {
  data:           IncomeStatement;
  loading:        boolean;
  period:         string;
  onPeriodChange: (p: string) => void;
}

export const IncomeStatementTemplate: React.FC<Props> = ({ data, loading, period, onPeriodChange }) => {
  const margin = data.netIncome > 0 && data.revenue.length > 0
    ? (() => {
        const totalRevenue = data.revenue.reduce((s, l) => s + l.amount, 0);
        return totalRevenue > 0 ? ((data.netIncome / totalRevenue) * 100).toFixed(1) + '%' : '-';
      })()
    : '-';

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-slate-500 text-sm mb-1">Finance / Laba Rugi</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">Laporan Laba Rugi</h1>
        </div>

        {/* Summary Cards */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <FinanceSummaryCard
              label="Laba Kotor"
              value={formatCurrencyIdr(data.grossProfit)}
              icon="trending-up"
              trend={data.grossProfit >= 0 ? 'up' : 'down'}
              sub={data.period}
            />
            <FinanceSummaryCard
              label="Laba Bersih"
              value={formatCurrencyIdr(data.netIncome)}
              icon="chart-bar"
              trend={data.netIncome >= 0 ? 'up' : 'down'}
              sub={data.period}
            />
            <FinanceSummaryCard
              label="Margin Laba Bersih"
              value={margin}
              icon="scale"
              trend={data.netIncome >= 0 ? 'up' : 'down'}
              sub="Laba Bersih / Pendapatan"
            />
          </div>
        )}

        {/* Income Statement Table */}
        <IncomeStatementTable
          data={data}
          loading={loading}
          period={period}
          onPeriodChange={onPeriodChange}
        />
      </main>
    </div>
  );
};
