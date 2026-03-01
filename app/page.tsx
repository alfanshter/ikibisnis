/**
 * Page Component: Home (Dashboard Page)
 * Main entry point for the dashboard application
 */

'use client';

import { useDashboard } from '@/src/presentation/hooks/dashboard/useDashboard';
import { DashboardTemplate } from '@/src/presentation/components/templates/DashboardTemplate';
import { LoadingTemplate } from '@/src/presentation/components/templates/LoadingTemplate';
import { ErrorTemplate } from '@/src/presentation/components/templates/ErrorTemplate';

export default function Home() {
  const { dashboard, loading, error, refresh } = useDashboard();

  if (loading) {
    return <LoadingTemplate />;
  }

  if (error || !dashboard) {
    return <ErrorTemplate message={error || 'Failed to load dashboard'} onRetry={refresh} />;
  }

  return <DashboardTemplate dashboard={dashboard} />;
}
