/**
 * Template: UserManagementTemplate
 * Composes all user-management organisms into a complete page layout
 */

'use client';

import React from 'react';
import {
  User,
  UserCollection,
  CreateUserDTO,
  UpdateUserDTO
} from '@/src/domain/entities/User';
import { Sidebar } from '../organisms/Sidebar';
import { TopBar } from '../organisms/TopBar';
import { UserTable } from '../organisms/UserTable';
import { UserModal } from '../organisms/UserModal';
import { DeleteConfirmModal } from '../organisms/DeleteConfirmModal';
import { Icon } from '../atoms/Icon';

interface UserManagementTemplateProps {
  /* Data */
  userCollection: UserCollection;

  /* Loading flags */
  tableLoading?: boolean;
  modalSaving?:  boolean;
  deleting?:     boolean;

  /* Modal state */
  showAddModal: boolean;
  editingUser:  User | null;
  deletingUser: User | null;

  /* Callbacks */
  onPageChange:       (page: number) => void;
  onAddUser:          () => void;
  onEditUser:         (user: User) => void;
  onDeleteUser:       (user: User) => void;
  onModalClose:       () => void;
  onModalSubmit:      (data: CreateUserDTO | UpdateUserDTO) => Promise<void>;
  onDeleteConfirm:    () => Promise<void>;
  onDeleteModalClose: () => void;
}

export const UserManagementTemplate: React.FC<UserManagementTemplateProps> = ({
  userCollection,
  tableLoading,
  modalSaving,
  deleting,
  showAddModal,
  editingUser,
  deletingUser,
  onPageChange,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onModalClose,
  onModalSubmit,
  onDeleteConfirm,
  onDeleteModalClose,
}) => (
  <div className="flex min-h-screen bg-slate-900">
    <Sidebar activePage="User Management" />

    <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8">
      <TopBar
        title="Pengguna"
        subtitle="Daftar semua pengguna yang berwenang mengakses konsol ini."
        action={
          <button
            onClick={onAddUser}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <Icon name="plus" className="w-4 h-4" />
            Tambah Pengguna
          </button>
        }
      />

      {/* Table */}
      <UserTable
        userCollection={userCollection}
        onEdit={onEditUser}
        onDelete={onDeleteUser}
        onPageChange={onPageChange}
        loading={tableLoading}
      />
    </main>

    {/* Modals */}
    {(showAddModal || editingUser) && (
      <UserModal
        mode={editingUser ? 'edit' : 'add'}
        user={editingUser ?? undefined}
        onClose={onModalClose}
        onSubmit={onModalSubmit}
        saving={modalSaving}
      />
    )}

    {deletingUser && (
      <DeleteConfirmModal
        user={deletingUser}
        onClose={onDeleteModalClose}
        onConfirm={onDeleteConfirm}
        deleting={deleting}
      />
    )}
  </div>
);

