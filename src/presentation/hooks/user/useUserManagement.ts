/**
 * Custom Hook: useUserManagement
 * Encapsulates all state + side effects for the User Management page
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  User,
  UserCollection,
  RolePermissions,
  CreateUserDTO,
  UpdateUserDTO,
  UserRole
} from '@/src/domain/entities/User';
import DIContainer from '@/src/infrastructure/di/container';

const DEFAULT_EMPTY_COLLECTION = new UserCollection(
  [],
  { currentPage: 1, totalPages: 1, totalUsers: 0, perPage: 4 }
);

export const useUserManagement = () => {
  /* ── Data ── */
  const [userCollection,      setUserCollection]      = useState<UserCollection>(DEFAULT_EMPTY_COLLECTION);
  const [selectedPermissions, setSelectedPermissions] = useState<RolePermissions | null>(null);

  /* ── Loading / saving flags ── */
  const [tableLoading, setTableLoading] = useState(true);
  const [panelSaving,  setPanelSaving]  = useState(false);
  const [modalSaving,  setModalSaving]  = useState(false);
  const [deleting,     setDeleting]     = useState(false);

  /* ── Modal state ── */
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser,  setEditingUser]  = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  /* ── Pagination ── */
  const [currentPage, setCurrentPage] = useState(1);

  /* ── DI shortcuts ── */
  const container = DIContainer.getInstance();

  /* ── Load users ── */
  const loadUsers = useCallback(async (page: number) => {
    try {
      setTableLoading(true);
      const data = await container.getGetUsersUseCase().execute(page, 4);
      setUserCollection(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setTableLoading(false);
    }
  }, [container]);

  useEffect(() => { loadUsers(currentPage); }, [currentPage, loadUsers]);

  /* ── Pagination ── */
  const handlePageChange = (page: number) => setCurrentPage(page);

  /* ── Add / Edit user modal ── */
  const handleAddUser    = () => { setEditingUser(null); setShowAddModal(true); };
  const handleEditUser   = (user: User) => { setShowAddModal(false); setEditingUser(user); };
  const handleModalClose = () => { setShowAddModal(false); setEditingUser(null); };

  const handleModalSubmit = async (data: CreateUserDTO | UpdateUserDTO) => {
    try {
      setModalSaving(true);
      if ('password' in data) {
        await container.getCreateUserUseCase().execute(data as CreateUserDTO);
      } else {
        await container.getUpdateUserUseCase().execute(data as UpdateUserDTO);
      }
      handleModalClose();
      await loadUsers(currentPage);
    } catch (err) {
      console.error('Failed to save user:', err);
    } finally {
      setModalSaving(false);
    }
  };

  /* ── Delete user ── */
  const handleDeleteUser       = (user: User) => setDeletingUser(user);
  const handleDeleteModalClose = () => setDeletingUser(null);

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    try {
      setDeleting(true);
      await container.getDeleteUserUseCase().execute(deletingUser.id);
      setDeletingUser(null);
      const newPage =
        userCollection.users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadUsers(newPage);
      setCurrentPage(newPage);
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setDeleting(false);
    }
  };

  /* ── Role management panel ── */
  const handleOpenRolePanel = async (user: User) => {
    try {
      const perms = await container.getGetRolePermissionsUseCase().execute(user.role as UserRole);
      setSelectedPermissions(perms);
    } catch (err) {
      console.error('Failed to load role permissions:', err);
    }
  };

  const handleRolePermissionsChange = (updated: RolePermissions) => setSelectedPermissions(updated);
  const handleRolePanelClose        = () => setSelectedPermissions(null);

  const handleRolePermissionsSave = async () => {
    if (!selectedPermissions) return;
    try {
      setPanelSaving(true);
      await container.getUpdateRolePermissionsUseCase().execute(selectedPermissions);
    } catch (err) {
      console.error('Failed to save permissions:', err);
    } finally {
      setPanelSaving(false);
    }
  };

  return {
    userCollection, selectedPermissions,
    tableLoading, panelSaving, modalSaving, deleting,
    showAddModal, editingUser, deletingUser,
    handlePageChange,
    handleAddUser, handleEditUser, handleDeleteUser,
    handleModalClose, handleModalSubmit,
    handleDeleteConfirm, handleDeleteModalClose,
    handleOpenRolePanel,
    handleRolePermissionsChange, handleRolePermissionsSave, handleRolePanelClose,
  };
};
