/**
 * Template: CashFlowTemplate
 * Layout for /finance/arus-kas — Arus Kas page.
 */
'use client';
import React from 'react';
import { Sidebar } from '@/src/presentation/components/organisms/Sidebar';
import { TopBar } from '@/src/presentation/components/organisms/TopBar';
import { FinanceSummaryCard } from '@/src/presentation/components/molecules/FinanceSummaryCard';
import { CashFlowTable } from '@/src/presentation/components/organisms/CashFlowTable';
import { CashFlow, formatCurrencyIdr } from '@/src/domain/entities/Finance';

interface Props {
  data:           CashFlow;
  loading:        boolean;
  period:         string;
  onPeriodChange: (p: string) => void;
}

export const CashFlowTemplate: React.FC<Props> = ({ data, loading, period, onPeriodChange }) => (
  <div className="flex min-h-screen bg-slate-950">
    <Sidebar />

    <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8 overflow-y-auto">
      <TopBar title="Laporan Arus Kas" subtitle="Pergerakan kas dari aktivitas operasi, investasi, dan pendanaan." />

      {/* Summary Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <FinanceSummaryCard
            label="Arus Kas Operasi"
            value={formatCurrencyIdr(data.operating.total)}
            icon="trending-up"
            trend={data.operating.total >= 0 ? 'up' : 'down'}
            sub={data.period}
          />
          <FinanceSummaryCard
            label="Kenaikan / (Penurunan) Kas"
            value={formatCurrencyIdr(data.netCashChange)}
            icon="water"
            trend={data.netCashChange >= 0 ? 'up' : 'down'}
            sub={data.period}
          />
          <FinanceSummaryCard
            label="Saldo Kas Akhir"
            value={formatCurrencyIdr(data.endingCash)}
            icon="bank"
            trend="neutral"
            sub={data.period}
          />
        </div>
      )}

      {/* Cash Flow Table */}
      <CashFlowTable
        data={data}
        loading={loading}
        period={period}
        onPeriodChange={onPeriodChange}
      />
    </main>
  </div>
);
