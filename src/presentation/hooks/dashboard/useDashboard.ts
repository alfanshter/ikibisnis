/**
 * Custom Hook: useDashboard
 * Manages dashboard state and side effects
 */

'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/src/domain/entities/Dashboard';
import DIContainer from '@/src/infrastructure/di/container';

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const useCase = DIContainer.getInstance().getGetDashboardDataUseCase();
      const data = await useCase.execute();
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboard,
    loading,
    error,
    refresh: loadDashboard
  };
};
