/**
 * Molecule Component: UserTableRow
 * Single row in the user management table — uses ApiUser from backend.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ApiUser } from '@/src/domain/entities/User';
import { Icon } from '../../atoms/Icon';
import { RoleBadge } from '../role/RoleBadge';
import { StatusBadge } from './StatusBadge';
import { UserAvatarComponent } from './UserAvatar';

interface UserTableRowProps {
  user:     ApiUser;
  onView:   (user: ApiUser) => void;
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
  user, onView, onEdit, onDelete, onToggle, onChangePassword,
  canUpdate = true, canDelete = true,
}) => {
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);

  const willDeactivate = user.isActive;

  return (
  <>
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
        {/* View detail */}
        <button onClick={() => onView(user)}
          className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
          title="Lihat detail">
          <Icon name="eye" className="w-4 h-4" />
        </button>
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
          <button
            onClick={() => setShowToggleConfirm(true)}
            className={`p-1.5 rounded-lg transition-all ${user.isActive ? 'text-slate-400 hover:text-orange-400 hover:bg-orange-500/10' : 'text-slate-400 hover:text-green-400 hover:bg-green-500/10'}`}
            title={user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
          >
            <Icon name="power" className="w-4 h-4" />
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

  {/* ── Toggle status confirm dialog ── */}
  {showToggleConfirm && typeof document !== 'undefined' && createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${willDeactivate ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
            <Icon name="power" className={`w-5 h-5 ${willDeactivate ? 'text-orange-400' : 'text-green-400'}`} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">
              {willDeactivate ? 'Nonaktifkan Pengguna?' : 'Aktifkan Pengguna?'}
            </h3>
            <p className="text-slate-400 text-xs">{user.fullName}</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          {willDeactivate
            ? `Pengguna "${user.fullName}" akan dinonaktifkan dan tidak dapat login sampai diaktifkan kembali.`
            : `Pengguna "${user.fullName}" akan diaktifkan kembali dan dapat login ke sistem.`
          }
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowToggleConfirm(false)}
            className="flex-1 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => { setShowToggleConfirm(false); onToggle(user); }}
            className={`flex-1 py-2.5 text-white text-sm font-semibold rounded-lg transition-all ${willDeactivate ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {willDeactivate ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}
  </>
  );
};


