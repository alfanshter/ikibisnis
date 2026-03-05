'use client';
import React from 'react';
import { BalanceSheetTemplate } from '@/src/presentation/templates/BalanceSheetTemplate';
import { useFinanceNeraca } from '@/src/presentation/hooks/finance/useFinanceNeraca';
import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';

export default function FinanceNeracaPage() {
  const props = useFinanceNeraca();
  return (
    <PermissionGuard feature="laporan_neraca">
      <BalanceSheetTemplate {...props} />
    </PermissionGuard>
  );
}
