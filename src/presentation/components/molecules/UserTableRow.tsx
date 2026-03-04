/**
 * Molecule Component: UserTableRow
 * Single row in the user management table
 */

import React from 'react';
import { User } from '@/src/domain/entities/User';
import { Icon } from '../atoms/Icon';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';
import { UserAvatarComponent } from './UserAvatar';

interface UserTableRowProps {
  user: User;
  onEdit:   (user: User) => void;
  onDelete: (user: User) => void;
}

const formatLastLogin = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)   return `${mins} mins ago`;
  if (hours < 24)  return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1)  return 'Yesterday';
  return `${days} days ago`;
};

export const UserTableRow: React.FC<UserTableRowProps> = ({ user, onEdit, onDelete }) => (
  <tr className="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors group">
    {/* USER */}
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <UserAvatarComponent avatar={user.avatar} name={user.name} size="md" />
        <div>
          <p className="text-white font-semibold text-sm">{user.name}</p>
          <p className="text-slate-400 text-xs">{user.email}</p>
          {user.phone && (
            <p className="text-slate-500 text-xs">{user.phone}</p>
          )}
        </div>
      </div>
    </td>

    {/* ROLE */}
    <td className="px-6 py-4">
      <RoleBadge role={user.role} />
    </td>

    {/* STATUS */}
    <td className="px-6 py-4">
      <StatusBadge status={user.status} />
    </td>

    {/* LAST LOGIN */}
    <td className="px-6 py-4 text-slate-400 text-sm">
      {formatLastLogin(user.lastLogin)}
    </td>

    {/* ACTIONS */}
    <td className="px-6 py-4">
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(user)}
          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          title="Edit user"
        >
          <Icon name="edit" className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(user)}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          title="Delete user"
        >
          <Icon name="trash" className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);
