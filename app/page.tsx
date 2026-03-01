/**
 * Page Component: Home (Dashboard Page)
 * Main entry point for the dashboard application
 */

'use client';

import { useDashboard } from '@/src/presentation/hooks/dashboard/useDashboard';
import { DashboardTemplate } from '@/src/presentation/components/templates/DashboardTemplate';
import { DashboardSkeleton } from '@/src/presentation/components/templates/DashboardSkeleton';
import { ErrorTemplate } from '@/src/presentation/components/templates/ErrorTemplate';

export default function Home() {
  const { dashboard, loading, error, refresh } = useDashboard();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !dashboard) {
    return <ErrorTemplate message={error || 'Failed to load dashboard'} onRetry={refresh} />;
  }

  return <DashboardTemplate dashboard={dashboard} />;
}
