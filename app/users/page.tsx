'use client';

import { useUserManagement } from '@/src/presentation/hooks/user/useUserManagement';
import { UserManagementTemplate } from '@/src/presentation/components/templates/UserManagementTemplate';

export default function UsersPage() {
  const {
    userCollection,
    tableLoading,
    modalSaving,
    deleting,
    showAddModal,
    editingUser,
    deletingUser,
    handlePageChange,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleModalClose,
    handleModalSubmit,
    handleDeleteConfirm,
    handleDeleteModalClose,
  } = useUserManagement();

  return (
    <UserManagementTemplate
      userCollection={userCollection}
      tableLoading={tableLoading}
      modalSaving={modalSaving}
      deleting={deleting}
      showAddModal={showAddModal}
      editingUser={editingUser}
      deletingUser={deletingUser}
      onPageChange={handlePageChange}
      onAddUser={handleAddUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
      onModalClose={handleModalClose}
      onModalSubmit={handleModalSubmit}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteModalClose={handleDeleteModalClose}
    />
  );
}

