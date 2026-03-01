/**
 * Hook: useFinanceNeraca
 * State + data for Neraca (Balance Sheet) page.
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import DIContainer from '@/src/infrastructure/di/container';
import { BalanceSheet } from '@/src/domain/entities/Finance';

const EMPTY: BalanceSheet = {
  period: '',
  assets: [], liabilities: [], equity: [],
  totalAssets: 0, totalLiabilities: 0, totalEquity: 0,
};

export const useFinanceNeraca = () => {
  const useCase = DIContainer.getInstance().getGetBalanceSheetUseCase();

  const [data,    setData]    = useState<BalanceSheet>(EMPTY);
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
