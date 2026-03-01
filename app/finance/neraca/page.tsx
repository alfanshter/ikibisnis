'use client';
import React from 'react';
import { BalanceSheetTemplate } from '@/src/presentation/templates/BalanceSheetTemplate';
import { useFinanceNeraca } from '@/src/presentation/hooks/finance/useFinanceNeraca';

export default function FinanceNeracaPage() {
  const props = useFinanceNeraca();
  return <BalanceSheetTemplate {...props} />;
}
