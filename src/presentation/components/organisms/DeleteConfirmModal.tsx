/**
 * Organism Component: DeleteConfirmModal
 * Confirmation dialog before deleting a user
 */

import React from 'react';
import { User } from '@/src/domain/entities/User';
import { Icon } from '../atoms/Icon';
import { UserAvatarComponent } from '../molecules/UserAvatar';

interface DeleteConfirmModalProps {
  user:     User;
  onClose:  () => void;
  onConfirm: () => Promise<void>;
  deleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  user,
  onClose,
  onConfirm,
  deleting = false
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-sm bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="trash" className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-white font-bold text-xl mb-1">Delete User</h2>
        <p className="text-slate-400 text-sm">This action cannot be undone.</p>
      </div>

      {/* User card */}
      <div className="mx-6 mb-6 flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <UserAvatarComponent avatar={user.avatar} name={user.name} size="md" />
        <div>
          <p className="text-white font-semibold text-sm">{user.name}</p>
          <p className="text-slate-400 text-xs">{user.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 px-6 pb-6">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {deleting && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          Delete User
        </button>
      </div>
    </div>
  </div>
);
