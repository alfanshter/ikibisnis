/**
 * Hook: useFinanceLabaRugi
 * State + data for Laba Rugi (Income Statement) page.
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import DIContainer from '@/src/infrastructure/di/container';
import { IncomeStatement } from '@/src/domain/entities/Finance';

const EMPTY: IncomeStatement = {
  period: '',
  revenue: [], cogs: [],
  grossProfit: 0,
  opex: [],
  operatingProfit: 0,
  otherIncome: [], otherExpense: [],
  ebt: 0, tax: 0, netIncome: 0,
};

export const useFinanceLabaRugi = () => {
  const useCase = DIContainer.getInstance().getGetIncomeStatementUseCase();

  const [data,    setData]    = useState<IncomeStatement>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState('Februari 2026');

  const loadData = useCallback(async (p: string) => {
    setLoading(true);
    try {
      const result = await useCase.execute(p);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [useCase]);

  useEffect(() => { loadData(period); }, [period, loadData]);

  return {
    data, loading, period,
    onPeriodChange: (p: string) => setPeriod(p),
  };
};
