/**
 * Organism Component: DashboardHeader
 * Top section with title, greeting, search, and actions
 */

'use client';

import React from 'react';
import { Icon } from '../atoms/Icon';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-slate-400">Good morning, Alex. Here is what&apos;s happening today.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search data, users, or projects..."
              className="w-80 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <Icon name="search" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
          
          <button className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors relative">
            <Icon name="bell" className="w-5 h-5 text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors">
            <Icon name="moon" className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
