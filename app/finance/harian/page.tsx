'use client';
import React from 'react';
import { DailyReportTemplate } from '@/src/presentation/templates/DailyReportTemplate';
import { useFinanceHarian } from '@/src/presentation/hooks/finance/useFinanceHarian';
import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';

export default function FinanceHarianPage() {
  const props = useFinanceHarian();
  return (
    <PermissionGuard feature="laporan_harian">
      <DailyReportTemplate {...props} />
    </PermissionGuard>
  );
}
