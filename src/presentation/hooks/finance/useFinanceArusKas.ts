/**
 * Hook: useFinanceArusKas
 * State + data for Arus Kas (Cash Flow) page.
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import DIContainer from '@/src/infrastructure/di/container';
import { CashFlow } from '@/src/domain/entities/Finance';

const EMPTY: CashFlow = {
  period: '',
  operating:  { title: 'Aktivitas Operasi',  lines: [], total: 0 },
  investing:  { title: 'Aktivitas Investasi', lines: [], total: 0 },
  financing:  { title: 'Aktivitas Pendanaan', lines: [], total: 0 },
  netCashChange: 0,
  beginningCash: 0,
  endingCash: 0,
};

export const useFinanceArusKas = () => {
  const useCase = DIContainer.getInstance().getGetCashFlowUseCase();

  const [data,    setData]    = useState<CashFlow>(EMPTY);
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
