/**
 * Molecule Component: StatusBadge
 * Displays user status with dot indicator
 */

import React from 'react';
import { UserStatus } from '@/src/domain/entities/User';

interface StatusBadgeProps {
  status: UserStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-slate-500'}`} />
      <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
        {status}
      </span>
    </div>
  );
};
