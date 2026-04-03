/**
 * Molecule Component: ActivityItem
 * Displays a single activity in the recent activities list
 */

import React from 'react';
import { Activity } from '@/src/domain/entities/Dashboard';
import { Icon } from '../../atoms/Icon';

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const iconBgColors = {
    payment: 'bg-green-500/10 text-green-400',
    user: 'bg-blue-500/10 text-blue-400',
    warning: 'bg-orange-500/10 text-orange-400',
    archive: 'bg-slate-500/10 text-slate-400'
  };

  const iconNames = {
    payment: 'check',
    user: 'users',
    warning: 'warning',
    archive: 'archive'
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800/30 transition-colors duration-200">
      <div className={`p-2.5 rounded-lg ${iconBgColors[activity.type]} shrink-0`}>
        <Icon name={iconNames[activity.type]} className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm mb-0.5">{activity.title}</h4>
        <p className="text-slate-400 text-xs truncate">{activity.description}</p>
        <span className="text-slate-500 text-xs mt-1 inline-block">
          {formatTimestamp(activity.timestamp)}
        </span>
      </div>
    </div>
  );
};
