/**
 * Organism Component: MetricsGrid
 * Grid layout for metric cards
 */

import React from 'react';
import { DashboardMetric } from '@/src/domain/entities/Dashboard';
import { MetricCard } from '../molecules/MetricCard';

interface MetricsGridProps {
  metrics: DashboardMetric[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} />
      ))}
    </div>
  );
};
