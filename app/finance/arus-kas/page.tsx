'use client';
import React from 'react';
import { CashFlowTemplate } from '@/src/presentation/templates/CashFlowTemplate';
import { useFinanceArusKas } from '@/src/presentation/hooks/finance/useFinanceArusKas';

export default function FinanceArusKasPage() {
  const props = useFinanceArusKas();
  return <CashFlowTemplate {...props} />;
}
