/**
 * Molecule Component: MetricCard
 * Displays a single metric with icon, value, and change percentage
 */

import React from 'react';
import { DashboardMetric } from '@/src/domain/entities/Dashboard';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';

interface MetricCardProps {
  metric: DashboardMetric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    red: 'bg-red-500/10 text-red-400',
    green: 'bg-green-500/10 text-green-400',
    orange: 'bg-orange-500/10 text-orange-400'
  };

  const progressColors = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500'
  };

  const formatValue = (value: number): string => {
    if (metric.label.includes('Revenue') || metric.label.includes('Expenses')) {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[metric.color]}`}>
          <Icon name={metric.icon} className="w-6 h-6" />
        </div>
        <Badge value={metric.change} />
      </div>
      
      <div className="space-y-2">
        <p className="text-slate-400 text-sm font-medium">{metric.label}</p>
        <h3 className="text-3xl font-bold text-white">{formatValue(metric.value)}</h3>
        
        <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full ${progressColors[metric.color]} rounded-full transition-all duration-500`}
            style={{ width: `${Math.abs(metric.change) * 5}%` }}
          />
        </div>
      </div>
    </div>
  );
};
