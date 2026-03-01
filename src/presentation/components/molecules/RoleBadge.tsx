/**
 * Molecule Component: RoleBadge
 * Displays user role with matching color pill
 */

import React from 'react';
import { UserRole } from '@/src/domain/entities/User';

interface RoleBadgeProps {
  role: UserRole;
}

const ROLE_STYLES: Record<UserRole, string> = {
  Admin:   'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  Manager: 'bg-blue-500/20   text-blue-300   border border-blue-500/30',
  Staff:   'bg-green-500/20  text-green-300  border border-green-500/30'
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${ROLE_STYLES[role]}`}>
    {role.toUpperCase()}
  </span>
);
