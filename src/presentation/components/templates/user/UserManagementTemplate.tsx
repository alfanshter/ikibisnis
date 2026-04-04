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
import { Sidebar } from '../../organisms/shared/Sidebar';
import { TopBar } from '../../organisms/shared/TopBar';
import { UserTable } from '../../organisms/user/UserTable';
import { UserModal, ChangePasswordModal } from '../../organisms/user/UserModal';
import { DeleteConfirmModal } from '../../organisms/user/DeleteConfirmModal';
import { Icon } from '../../atoms/Icon';
import { usePermission } from '@/src/presentation/hooks/auth/usePermission';

/** Sidebar-style custom select dropdown (matches Projects page) */
interface SelectOption { value: string; label: string }
interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
}
const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
          open
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            : 'text-slate-400 hover:bg-slate-800/80 hover:text-white border-slate-700/50'
        }`}
      >
        <span className="whitespace-nowrap">{selected?.label}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} className="w-3.5 h-3.5 shrink-0" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[10rem] bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl z-50 py-1">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 text-sm transition-all duration-150 ${
                value === opt.value
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
}) => {
  const { canWrite, canUpdate, canDelete } = usePermission('user_management_users');

  return (
  <div className="flex min-h-screen bg-slate-900">
    <Sidebar activePage="User Management" />

    <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8">
      <TopBar
        title="Pengguna"
        subtitle="Daftar semua pengguna yang berwenang mengakses konsol ini."
        action={canWrite ? (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <Icon name="plus" className="w-4 h-4" />
            Tambah Pengguna
          </button>
        ) : (
          <span className="flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-slate-500 font-semibold text-sm rounded-xl cursor-not-allowed border border-slate-700/50" title="Tidak ada izin tambah pengguna">
            <Icon name="lock" className="w-4 h-4" />
            Tambah Pengguna
          </span>
        )}
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
        <CustomSelect
          value={query.isActive === undefined ? '' : String(query.isActive)}
          options={[
            { value: '', label: 'Semua Status' },
            { value: 'true', label: 'Aktif' },
            { value: 'false', label: 'Non-aktif' },
          ]}
          onChange={v => onFilterChange({ isActive: v === '' ? undefined : v === 'true' })}
        />

        {/* Gender filter */}
        <CustomSelect
          value={query.gender ?? ''}
          options={[
            { value: '', label: 'Semua Gender' },
            { value: 'male', label: 'Laki-laki' },
            { value: 'female', label: 'Perempuan' },
          ]}
          onChange={v => onFilterChange({ gender: v === '' ? undefined : v as 'male' | 'female' })}
        />
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
        canUpdate={canUpdate}
        canDelete={canDelete}
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
};
