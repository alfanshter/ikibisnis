'use client';
import React from 'react';
import { DailyReportTemplate } from '@/src/presentation/templates/DailyReportTemplate';
import { useFinanceHarian } from '@/src/presentation/hooks/finance/useFinanceHarian';

export default function FinanceHarianPage() {
  const props = useFinanceHarian();
  return <DailyReportTemplate {...props} />;
}
