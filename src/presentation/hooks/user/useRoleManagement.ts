/**
 * Hook: useRoleManagement
 * Manages state for the dedicated Roles page.
 * Loads all 3 roles, allows switching between them, and saving permissions.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { RolePermissions, UserRole } from '@/src/domain/entities/User';
import DIContainer from '@/src/infrastructure/di/container';

const ALL_ROLES: UserRole[] = ['Admin', 'Manager', 'Staff'];

export const useRoleManagement = () => {
  const container   = DIContainer.getInstance();
  const getRoleUC   = container.getGetRolePermissionsUseCase();
  const saveRoleUC  = container.getUpdateRolePermissionsUseCase();

  const [activeRole,   setActiveRole]   = useState<UserRole>('Admin');
  const [permissions,  setPermissions]  = useState<RolePermissions | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadRole = useCallback(async (role: UserRole) => {
    setLoading(true);
    try {
      const data = await getRoleUC.execute(role);
      setPermissions(data);
    } catch {
      showToast('Gagal memuat data role', 'error');
    } finally {
      setLoading(false);
    }
  }, [getRoleUC]);

  useEffect(() => { loadRole(activeRole); }, [activeRole, loadRole]);

  const handleTabChange = (role: UserRole) => {
    setActiveRole(role);
  };

  const handlePermissionsChange = (updated: RolePermissions) => {
    setPermissions(updated);
  };

  const handleSave = async () => {
    if (!permissions) return;
    setSaving(true);
    try {
      const saved = await saveRoleUC.execute(permissions);
      setPermissions(saved);
      showToast(`Hak akses role ${permissions.role} berhasil disimpan`);
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    allRoles: ALL_ROLES,
    activeRole,
    permissions,
    loading,
    saving,
    toast,
    onTabChange:         handleTabChange,
    onPermissionsChange: handlePermissionsChange,
    onSave:              handleSave,
  };
};
