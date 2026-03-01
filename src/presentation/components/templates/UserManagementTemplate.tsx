/**
 * Template: UserManagementTemplate
 * Composes all user-management organisms into a complete page layout
 */

'use client';

import React from 'react';
import {
  User,
  UserCollection,
  RolePermissions,
  CreateUserDTO,
  UpdateUserDTO
} from '@/src/domain/entities/User';
import { Sidebar } from '../organisms/Sidebar';
import { UserTable } from '../organisms/UserTable';
import { RoleManagementPanel } from '../organisms/RoleManagementPanel';
import { UserModal } from '../organisms/UserModal';
import { DeleteConfirmModal } from '../organisms/DeleteConfirmModal';
import { Icon } from '../atoms/Icon';

interface UserManagementTemplateProps {
  /* Data */
  userCollection:     UserCollection;
  selectedPermissions: RolePermissions | null;

  /* Loading flags */
  tableLoading?:  boolean;
  panelSaving?:   boolean;
  modalSaving?:   boolean;
  deleting?:      boolean;

  /* Modal state */
  showAddModal:    boolean;
  editingUser:     User | null;
  deletingUser:    User | null;

  /* Callbacks */
  onPageChange:         (page: number) => void;
  onAddUser:            () => void;
  onEditUser:           (user: User) => void;
  onDeleteUser:         (user: User) => void;
  onModalClose:         () => void;
  onModalSubmit:        (data: CreateUserDTO | UpdateUserDTO) => Promise<void>;
  onDeleteConfirm:      () => Promise<void>;
  onDeleteModalClose:   () => void;
  onOpenRolePanel:      (user: User) => void;
  onRolePermissionsChange: (updated: RolePermissions) => void;
  onRolePermissionsSave: () => void;
  onRolePanelClose:     () => void;
}

export const UserManagementTemplate: React.FC<UserManagementTemplateProps> = ({
  userCollection,
  selectedPermissions,
  tableLoading,
  panelSaving,
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
  onRolePermissionsChange,
  onRolePermissionsSave,
  onRolePanelClose,
}) => (
  <div className="flex min-h-screen bg-slate-900">
    <Sidebar activePage="Users" />

    <main className="flex-1 ml-64 p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">User Management</h1>
          <p className="text-slate-400 text-sm">
            Directory of all users authorized to access the console.
          </p>
        </div>
        <button
          onClick={onAddUser}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <Icon name="plus" className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Main Layout: Table + Role Panel */}
      <div className="flex gap-6 items-start">
        {/* Table fills remaining space */}
        <div className={selectedPermissions ? 'flex-1 min-w-0' : 'w-full'}>
          <UserTable
            userCollection={userCollection}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
            onPageChange={onPageChange}
            loading={tableLoading}
          />
        </div>

        {/* Role Management Panel (slides in) */}
        {selectedPermissions && (
          <div className="w-80 shrink-0">
            <RoleManagementPanel
              permissions={selectedPermissions}
              onClose={onRolePanelClose}
              onChange={onRolePermissionsChange}
              onSave={onRolePermissionsSave}
              saving={panelSaving}
            />
          </div>
        )}
      </div>
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
