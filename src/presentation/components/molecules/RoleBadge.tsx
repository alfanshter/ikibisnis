/**
 * Molecule Component: RoleBadge
 * Displays a role pill using the role's own badgeColor from the API.
 */

import React from 'react';

interface RoleBadgeProps {
  name:       string;
  badgeColor?: string;  // hex color from API e.g. "#DC2626"
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ name, badgeColor }) => (
  <span
    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border"
    style={badgeColor ? {
      backgroundColor: `${badgeColor}22`,
      color:           badgeColor,
      borderColor:     `${badgeColor}55`,
    } : {
      backgroundColor: 'rgba(107,114,128,0.15)',
      color:           '#9ca3af',
      borderColor:     'rgba(107,114,128,0.3)',
    }}
  >
    {name.toUpperCase()}
  </span>
);
