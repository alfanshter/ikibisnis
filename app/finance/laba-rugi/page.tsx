'use client';
import React from 'react';
import { IncomeStatementTemplate } from '@/src/presentation/templates/IncomeStatementTemplate';
import { useFinanceLabaRugi } from '@/src/presentation/hooks/finance/useFinanceLabaRugi';

export default function FinanceLabaRugiPage() {
  const props = useFinanceLabaRugi();
  return <IncomeStatementTemplate {...props} />;
}
