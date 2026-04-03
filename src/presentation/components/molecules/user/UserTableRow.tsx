/**
 * Molecule Component: UserTableRow
 * Single row in the user management table — uses ApiUser from backend.
 */

import React from 'react';
import { ApiUser } from '@/src/domain/entities/User';
import { Icon } from '../../atoms/Icon';
import { RoleBadge } from '../role/RoleBadge';
import { StatusBadge } from './StatusBadge';
import { UserAvatarComponent } from './UserAvatar';

interface UserTableRowProps {
  user:     ApiUser;
  onEdit:   (user: ApiUser) => void;
  onDelete: (user: ApiUser) => void;
  onToggle: (user: ApiUser) => void;
  onChangePassword: (user: ApiUser) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return '-'; }
};

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user, onEdit, onDelete, onToggle, onChangePassword,
  canUpdate = true, canDelete = true,
}) => (
  <tr className="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors group">
    {/* USER */}
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <UserAvatarComponent fullName={user.fullName} size="md" />
        <div>
          <p className="text-white font-semibold text-sm">{user.fullName}</p>
          <p className="text-slate-400 text-xs">{user.email}</p>
          {user.phone && <p className="text-slate-500 text-xs">{user.phone}</p>}
        </div>
      </div>
    </td>

    {/* ROLE */}
    <td className="px-6 py-4">
      {user.roleName
        ? <RoleBadge name={user.roleName} />
        : <span className="text-slate-500 text-xs">—</span>
      }
    </td>

    {/* STATUS */}
    <td className="px-6 py-4">
      <StatusBadge isActive={user.isActive} />
    </td>

    {/* CREATED */}
    <td className="px-6 py-4 text-slate-400 text-sm">
      {formatDate(user.createdAt)}
    </td>

    {/* ACTIONS */}
    <td className="px-6 py-4">
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {canUpdate ? (
          <button onClick={() => onEdit(user)}
            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
            title="Edit">
            <Icon name="edit" className="w-4 h-4" />
          </button>
        ) : (
          <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Tidak ada izin edit">
            <Icon name="lock" className="w-4 h-4" />
          </span>
        )}
        {canUpdate ? (
          <button onClick={() => onChangePassword(user)}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
            title="Ganti password">
            <Icon name="key" className="w-4 h-4" />
          </button>
        ) : (
          <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Tidak ada izin ubah password">
            <Icon name="lock" className="w-4 h-4" />
          </span>
        )}
        {canUpdate ? (
          <button onClick={() => onToggle(user)}
            className={`p-1.5 rounded-lg transition-all ${user.isActive ? 'text-slate-400 hover:text-orange-400 hover:bg-orange-500/10' : 'text-slate-400 hover:text-green-400 hover:bg-green-500/10'}`}
            title={user.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
            <Icon name={user.isActive ? 'eye-off' : 'eye'} className="w-4 h-4" />
          </button>
        ) : (
          <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Tidak ada izin ubah status">
            <Icon name="lock" className="w-4 h-4" />
          </span>
        )}
        {canDelete ? (
          <button onClick={() => onDelete(user)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Hapus">
            <Icon name="trash" className="w-4 h-4" />
          </button>
        ) : (
          <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Tidak ada izin hapus">
            <Icon name="lock" className="w-4 h-4" />
          </span>
        )}
      </div>
    </td>
  </tr>
);


