/**
 * Template Component: DashboardTemplate
 * Main layout template for dashboard page
 */

'use client';

import React from 'react';
import { Dashboard } from '@/src/domain/entities/Dashboard';
import { Sidebar } from '../organisms/Sidebar';
import { DashboardHeader } from '../organisms/DashboardHeader';
import { MetricsGrid } from '../organisms/MetricsGrid';
import { ProjectStatusSection } from '../organisms/ProjectStatusSection';
import { RecentActivitySection } from '../organisms/RecentActivitySection';

interface DashboardTemplateProps {
  dashboard: Dashboard;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ dashboard }) => {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <DashboardHeader />
        
        <MetricsGrid metrics={dashboard.metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProjectStatusSection statuses={dashboard.projectStatuses} />
          </div>
          
          <div className="lg:col-span-1">
            <RecentActivitySection activities={dashboard.recentActivities} />
          </div>
        </div>
      </main>
    </div>
  );
};
