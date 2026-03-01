/**
 * Molecule Component: UserAvatar
 * Displays user avatar with initials fallback
 */

import React from 'react';
import { UserAvatar as UserAvatarType } from '@/src/domain/entities/User';

interface UserAvatarProps {
  avatar: UserAvatarType;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
};

export const UserAvatarComponent: React.FC<UserAvatarProps> = ({
  avatar,
  name,
  size = 'md'
}) => (
  <div
    className={`${SIZE_CLASSES[size]} ${avatar.bgColor} rounded-full flex items-center justify-center shrink-0 ring-2 ring-slate-700`}
    title={name}
  >
    <span className="text-white font-bold">{avatar.initials}</span>
  </div>
);
