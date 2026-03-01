'use client';

import { useUserManagement } from '@/src/presentation/hooks/user/useUserManagement';
import { UserManagementTemplate } from '@/src/presentation/components/templates/UserManagementTemplate';

export default function UsersPage() {
  const {
    /* Data */
    userCollection,
    selectedPermissions,
    /* Flags */
    tableLoading,
    panelSaving,
    modalSaving,
    deleting,
    /* Modal state */
    showAddModal,
    editingUser,
    deletingUser,
    /* Handlers → mapped to on* prop names expected by the template */
    handlePageChange,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleModalClose,
    handleModalSubmit,
    handleDeleteConfirm,
    handleDeleteModalClose,
    handleOpenRolePanel,
    handleRolePermissionsChange,
    handleRolePermissionsSave,
    handleRolePanelClose
  } = useUserManagement();

  return (
    <UserManagementTemplate
      /* Data */
      userCollection={userCollection}
      selectedPermissions={selectedPermissions}
      /* Flags */
      tableLoading={tableLoading}
      panelSaving={panelSaving}
      modalSaving={modalSaving}
      deleting={deleting}
      /* Modal state */
      showAddModal={showAddModal}
      editingUser={editingUser}
      deletingUser={deletingUser}
      /* Callbacks */
      onPageChange={handlePageChange}
      onAddUser={handleAddUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
      onModalClose={handleModalClose}
      onModalSubmit={handleModalSubmit}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteModalClose={handleDeleteModalClose}
      onOpenRolePanel={handleOpenRolePanel}
      onRolePermissionsChange={handleRolePermissionsChange}
      onRolePermissionsSave={handleRolePermissionsSave}
      onRolePanelClose={handleRolePanelClose}
    />
  );
}
