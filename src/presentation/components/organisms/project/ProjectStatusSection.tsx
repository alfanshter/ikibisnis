/**
 * Organism Component: ProjectStatusSection
 * Section displaying project status breakdown
 */

'use client';

import React, { useState } from 'react';
import { ProjectStatus } from '@/src/domain/entities/Dashboard';
import { ProjectStatusChart } from '../../molecules/project/ProjectStatusChart';

interface ProjectStatusSectionProps {
  statuses: ProjectStatus[];
}

export const ProjectStatusSection: React.FC<ProjectStatusSectionProps> = ({ statuses }) => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Project Status Breakdown</h2>
          <p className="text-slate-400 text-sm">Resource allocation across active work</p>
        </div>
        
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-sm text-white appearance-none pr-10 cursor-pointer hover:border-slate-500/50 transition-colors focus:outline-none focus:border-blue-500/50"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <ProjectStatusChart statuses={statuses} />
    </div>
  );
};
