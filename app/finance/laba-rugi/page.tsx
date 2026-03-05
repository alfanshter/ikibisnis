'use client';
import React from 'react';
import { IncomeStatementTemplate } from '@/src/presentation/templates/IncomeStatementTemplate';
import { useFinanceLabaRugi } from '@/src/presentation/hooks/finance/useFinanceLabaRugi';
import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';

export default function FinanceLabaRugiPage() {
  const props = useFinanceLabaRugi();
  return (
    <PermissionGuard feature="laporan_laba_rugi">
      <IncomeStatementTemplate {...props} />
    </PermissionGuard>
  );
}
