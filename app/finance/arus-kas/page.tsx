'use client';
import React from 'react';
import { CashFlowTemplate } from '@/src/presentation/templates/CashFlowTemplate';
import { useFinanceArusKas } from '@/src/presentation/hooks/finance/useFinanceArusKas';
import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';

export default function FinanceArusKasPage() {
  const props = useFinanceArusKas();
  return (
    <PermissionGuard feature="laporan_arus_kas">
      <CashFlowTemplate {...props} />
    </PermissionGuard>
  );
}
