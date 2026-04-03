/**
 * Molecule Component: ProjectStatusChart
 * Displays project status breakdown as a bar chart
 */

'use client';

import React from 'react';
import { ProjectStatus } from '@/src/domain/entities/Dashboard';

interface ProjectStatusChartProps {
  statuses: ProjectStatus[];
}

export const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ statuses }) => {
  const maxCount = Math.max(...statuses.map(s => s.count));

  const statusColors = {
    'To Do': 'bg-slate-500',
    'In Progress': 'bg-blue-500',
    'Review': 'bg-purple-500',
    'Completed': 'bg-green-500',
    'On Hold': 'bg-orange-500'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 h-48">
        {statuses.map((status) => (
          <div key={status.status} className="flex-1 flex flex-col items-center justify-end gap-2">
            <div className="relative w-full flex items-end justify-center">
              <div 
                className={`w-full ${statusColors[status.status]} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer`}
                style={{ height: `${(status.count / maxCount) * 100}%` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{status.count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between gap-2">
        {statuses.map((status) => (
          <div key={status.status} className="flex-1 text-center">
            <p className="text-slate-400 text-xs font-medium truncate">{status.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
