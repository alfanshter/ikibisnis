/**
 * Molecule Component: UserAvatar
 * Generates initials avatar from a fullName string.
 * No longer depends on a UserAvatar data object.
 */

import React from 'react';

interface UserAvatarProps {
  fullName: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'w-8  h-8  text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

// Deterministic color from name
const BG_COLORS = [
  'bg-blue-600',  'bg-purple-600', 'bg-green-600',
  'bg-amber-600', 'bg-rose-600',   'bg-cyan-600',
  'bg-teal-600',  'bg-indigo-600',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getBgColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}

export const UserAvatarComponent: React.FC<UserAvatarProps> = ({ fullName, size = 'md' }) => (
  <div
    className={`${SIZE_CLASSES[size]} ${getBgColor(fullName)} rounded-full flex items-center justify-center shrink-0 ring-2 ring-slate-700`}
    title={fullName}
  >
    <span className="text-white font-bold">{getInitials(fullName)}</span>
  </div>
);
