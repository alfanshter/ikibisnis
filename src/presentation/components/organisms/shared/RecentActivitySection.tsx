/**
 * Organism Component: RecentActivitySection
 * Section displaying recent activities
 */

import React from 'react';
import { Activity } from '@/src/domain/entities/Dashboard';
import { ActivityItem } from '../../molecules/shared/ActivityItem';

interface RecentActivitySectionProps {
  activities: Activity[];
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ activities }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          View All Activity
        </button>
      </div>
      
      <div className="space-y-2">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
