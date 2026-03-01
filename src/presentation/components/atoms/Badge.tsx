/**
 * Atom Component: Badge
 * Displays percentage change indicator
 */

import React from 'react';

interface BadgeProps {
  value: number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ value, className = '' }) => {
  const isPositive = value >= 0;
  const color = isPositive ? 'text-green-400' : 'text-red-400';

  return (
    <span className={`text-xs font-semibold ${color} ${className}`}>
      {isPositive ? '+' : ''}{value.toFixed(1)}%
    </span>
  );
};
