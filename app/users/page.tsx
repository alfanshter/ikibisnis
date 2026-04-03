'use client';

import { useUserManagement } from '@/src/presentation/hooks/user/useUserManagement';
import { UserManagementTemplate } from '@/src/presentation/components/templates/user/UserManagementTemplate';
import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';

export default function UsersPage() {
  const {
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
    handleCreate,
    handleUpdate,
    handleChangePassword,
    handleToggleStatus,
    handleDelete,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    openCreate,
    openEdit,
    openDeleteConfirm,
    openChangePassword,
    closeCreate,
    closeEdit,
    closeDeleteConfirm,
    closeChangePassword,
  } = useUserManagement();

  return (
    <PermissionGuard feature="user_management_users">
      <UserManagementTemplate
        collection={collection}
        query={query}
        toast={toast}
        listLoading={listLoading}
        saving={saving}
        showCreateModal={showCreateModal}
        showEditModal={showEditModal}
        showDeleteConfirm={showDeleteConfirm}
        showChangePasswordModal={showChangePasswordModal}
        editingUser={editingUser}
        deletingUser={deletingUser}
        passwordUser={passwordUser}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onChangePassword={handleChangePassword}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        openCreate={openCreate}
        openEdit={openEdit}
        openDeleteConfirm={openDeleteConfirm}
        openChangePassword={openChangePassword}
        closeCreate={closeCreate}
        closeEdit={closeEdit}
        closeDeleteConfirm={closeDeleteConfirm}
        closeChangePassword={closeChangePassword}
      />
    </PermissionGuard>
  );
}
