/**
 * Molecule Component: StatusBadge
 * Accepts boolean isActive (from API) or legacy 'Active'/'Inactive' string.
 */

import React from 'react';

interface StatusBadgeProps {
  isActive: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive }) => (
  <div className="flex items-center gap-2">
    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-slate-500'}`} />
    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
      {isActive ? 'Aktif' : 'Non-aktif'}
    </span>
  </div>
);
