/**
 * Template: UserManagementTemplate
 * Composes all user-management organisms into a complete page layout
 */

'use client';

import React from 'react';
import {
  ApiUser,
  ApiUserCollection,
  CreateUserApiDTO,
  UpdateUserApiDTO,
  ChangePasswordDTO,
  GetUsersQuery,
} from '@/src/domain/entities/User';
import { ToastState } from '@/src/presentation/hooks/user/useUserManagement';
import { Sidebar } from '../organisms/Sidebar';
import { TopBar } from '../organisms/TopBar';
import { UserTable } from '../organisms/UserTable';
import { UserModal, ChangePasswordModal } from '../organisms/UserModal';
import { DeleteConfirmModal } from '../organisms/DeleteConfirmModal';
import { Icon } from '../atoms/Icon';

interface UserManagementTemplateProps {
  /* Data */
  collection:     ApiUserCollection | null;
  query:          GetUsersQuery;
  toast:          ToastState | null;

  /* Loading flags */
  listLoading?:  boolean;
  saving?:       boolean;

  /* Modal state */
  showCreateModal:          boolean;
  showEditModal:            boolean;
  showDeleteConfirm:        boolean;
  showChangePasswordModal:  boolean;
  editingUser:              ApiUser | null;
  deletingUser:             ApiUser | null;
  passwordUser:             ApiUser | null;

  /* Callbacks — data */
  onPageChange:        (page: number) => void;
  onSearchChange:      (search: string) => void;
  onFilterChange:      (patch: Partial<GetUsersQuery>) => void;

  /* Callbacks — actions */
  onCreate:            (dto: CreateUserApiDTO) => Promise<void>;
  onUpdate:            (id: string, dto: UpdateUserApiDTO) => Promise<void>;
  onChangePassword:    (id: string, dto: ChangePasswordDTO) => Promise<void>;
  onToggleStatus:      (user: ApiUser) => void;
  onDelete:            () => Promise<void>;

  /* Modal open/close */
  openCreate:          () => void;
  openEdit:            (user: ApiUser) => void;
  openDeleteConfirm:   (user: ApiUser) => void;
  openChangePassword:  (user: ApiUser) => void;
  closeCreate:         () => void;
  closeEdit:           () => void;
  closeDeleteConfirm:  () => void;
  closeChangePassword: () => void;
}

export const UserManagementTemplate: React.FC<UserManagementTemplateProps> = ({
  collection,
  query,
  toast,
  listLoading,
  saving,
  showCreateModal,
  showEditModal,
  showDeleteConfirm,
  showChangePasswordModal,
  editingUser,
  deletingUser,
  passwordUser,
  onPageChange,
  onSearchChange,
  onFilterChange,
  onCreate,
  onUpdate,
  onChangePassword,
  onToggleStatus,
  onDelete,
  openCreate,
  openEdit,
  openDeleteConfirm,
  openChangePassword,
  closeCreate,
  closeEdit,
  closeDeleteConfirm,
  closeChangePassword,
}) => (
  <div className="flex min-h-screen bg-slate-900">
    <Sidebar activePage="User Management" />

    <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8">
      <TopBar
        title="Pengguna"
        subtitle="Daftar semua pengguna yang berwenang mengakses konsol ini."
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <Icon name="plus" className="w-4 h-4" />
            Tambah Pengguna
          </button>
        }
      />

      {/* Search & Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-50">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama / email..."
            defaultValue={query.search ?? ''}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70"
          />
        </div>

        {/* Status filter */}
        <select
          value={query.isActive === undefined ? '' : String(query.isActive)}
          onChange={e => onFilterChange({ isActive: e.target.value === '' ? undefined : e.target.value === 'true' })}
          className="px-3 py-2 bg-slate-800 border border-slate-700/50 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/70"
        >
          <option value="">Semua Status</option>
          <option value="true">Aktif</option>
          <option value="false">Non-aktif</option>
        </select>

        {/* Gender filter */}
        <select
          value={query.gender ?? ''}
          onChange={e => onFilterChange({ gender: e.target.value as 'male' | 'female' | undefined || undefined })}
          className="px-3 py-2 bg-slate-800 border border-slate-700/50 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/70"
        >
          <option value="">Semua Gender</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>

      {/* Table */}
      <UserTable
        collection={collection}
        onEdit={openEdit}
        onDelete={openDeleteConfirm}
        onToggle={onToggleStatus}
        onChangePassword={openChangePassword}
        onPageChange={onPageChange}
        loading={listLoading}
      />
    </main>

    {/* Toast notification */}
    {toast && (
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all
          ${toast.type === 'success'
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
            : 'bg-red-500/20 border border-red-500/40 text-red-300'}`}
      >
        <Icon
          name={toast.type === 'success' ? 'check-circle' : 'x-circle'}
          className="w-4 h-4 shrink-0"
        />
        {toast.msg}
      </div>
    )}

    {/* Create modal */}
    {showCreateModal && (
      <UserModal
        mode="add"
        onClose={closeCreate}
        onSubmit={async (dto) => {
          await onCreate(dto as CreateUserApiDTO);
        }}
        saving={saving}
      />
    )}

    {/* Edit modal */}
    {showEditModal && editingUser && (
      <UserModal
        mode="edit"
        user={editingUser}
        onClose={closeEdit}
        onSubmit={async (dto) => {
          await onUpdate(editingUser.id, dto as UpdateUserApiDTO);
        }}
        saving={saving}
      />
    )}

    {/* Change password modal */}
    {showChangePasswordModal && passwordUser && (
      <ChangePasswordModal
        user={passwordUser}
        onClose={closeChangePassword}
        onSubmit={async (dto) => {
          await onChangePassword(passwordUser.id, dto);
        }}
        saving={saving}
      />
    )}

    {/* Delete confirm modal */}
    {showDeleteConfirm && deletingUser && (
      <DeleteConfirmModal
        user={deletingUser}
        onClose={closeDeleteConfirm}
        onConfirm={onDelete}
        deleting={saving}
      />
    )}
  </div>
);
