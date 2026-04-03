/**
 * Hook: useRoleManagement
 * All operations go through the real /api/v1/roles REST API.
 * Follows clean architecture: hook â†’ fetch â†’ API route â†’ use-case â†’ repository.
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Role,
  RoleCollection,
  CreateRoleApiDTO,
  UpdateRoleApiDTO,
  GetRolesQuery,
} from '@/src/domain/entities/Role';
import { apiFetch } from '@/src/infrastructure/api/apiFetch';

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BASE = `/api/proxy/v1/roles`;

// â”€â”€ Toast type â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface ToastState {
  msg:  string;
  type: 'success' | 'error';
}

// â”€â”€ Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const useRoleManagement = () => {
  // â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [collection,        setCollection]        = useState<RoleCollection | null>(null);
  const [selectedRole,      setSelectedRole]       = useState<Role | null>(null);
  const [detailLoading,     setDetailLoading]      = useState(false);
  const [listLoading,       setListLoading]        = useState(true);
  const [saving,            setSaving]             = useState(false);
  const [toast,             setToast]              = useState<ToastState | null>(null);
  const [showCreateModal,   setShowCreateModal]    = useState(false);
  const [showEditModal,     setShowEditModal]      = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm]  = useState(false);
  const [editingRole,       setEditingRole]        = useState<Role | null>(null);
  const [deletingRole,      setDeletingRole]       = useState<Role | null>(null);
  const [query,             setQuery]              = useState<GetRolesQuery>({ page: 1, limit: 10 });

  // Abort controller for in-flight list requests
  const abortRef = useRef<AbortController | null>(null);

  // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const showToast = useCallback((msg: string, type: ToastState['type'] = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // â”€â”€ Fetch list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchRoles = useCallback(async (q: GetRolesQuery) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setListLoading(true);
    try {
      const sp = new URLSearchParams();
      sp.set('page',  String(q.page  ?? 1));
      sp.set('limit', String(q.limit ?? 10));
      if (q.search)                sp.set('search',   q.search);
      if (q.isActive !== undefined) sp.set('isActive', String(q.isActive));

      const data = await apiFetch<RoleCollection>(
        `${BASE}?${sp.toString()}`,
        { signal: ctrl.signal }
      );
      setCollection(data);
      // Auto-select first role if none selected
      setSelectedRole(prev => (prev ? prev : (data.data[0] ?? null)));
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        showToast((err as Error).message, 'error');
      }
    } finally {
      setListLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchRoles(query); }, [query, fetchRoles]);

  // â”€â”€ Select a role (loads fresh detail) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSelectRole = useCallback(async (role: Role) => {
    setDetailLoading(true);
    setSelectedRole(role);
    try {
      const fresh = await apiFetch<Role>(`${BASE}/${role.id}`);
      setSelectedRole(fresh);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setDetailLoading(false);
    }
  }, [showToast]);

  // â”€â”€ Create â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreateRole = useCallback(async (dto: CreateRoleApiDTO) => {
    setSaving(true);
    try {
      const created = await apiFetch<Role>(BASE, {
        method: 'POST',
        body:   JSON.stringify(dto),
      });
      setShowCreateModal(false);
      showToast(`Role "${created.name}" berhasil dibuat`);
      setQuery(q => ({ ...q }));
      setSelectedRole(created);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  // â”€â”€ Update (from edit modal) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleUpdateRole = useCallback(async (id: string, dto: UpdateRoleApiDTO) => {
    setSaving(true);
    try {
      const updated = await apiFetch<Role>(`${BASE}/${id}`, {
        method: 'PUT',
        body:   JSON.stringify(dto),
      });
      setShowEditModal(false);
      setEditingRole(null);
      setSelectedRole(updated);
      showToast(`Role "${updated.name}" berhasil diperbarui`);
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  // â”€â”€ Save permissions inline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSavePermissions = useCallback(async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      const updated = await apiFetch<Role>(`${BASE}/${selectedRole.id}`, {
        method: 'PUT',
        body:   JSON.stringify({ permissions: selectedRole.permissions }),
      });
      setSelectedRole(updated);
      showToast(`Permissions role "${updated.name}" tersimpan`);
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [selectedRole, showToast]);

  // â”€â”€ Toggle active status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleToggleStatus = useCallback(async (role: Role) => {
    try {
      const updated = await apiFetch<Role>(`${BASE}/${role.id}/toggle-status`, {
        method: 'PATCH',
      });
      setSelectedRole(prev => (prev?.id === updated.id ? updated : prev));
      showToast(`Status "${updated.name}" â†’ ${updated.isActive ? 'Aktif' : 'Nonaktif'}`);
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [showToast]);

  // â”€â”€ Soft delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDeleteRole = useCallback(async () => {
    if (!deletingRole) return;
    setSaving(true);
    try {
      await apiFetch<{ message: string }>(`${BASE}/${deletingRole.id}`, { method: 'DELETE' });
      setShowDeleteConfirm(false);
      setDeletingRole(null);
      setSelectedRole(null);
      showToast('Role berhasil dihapus');
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [deletingRole, showToast]);

  // â”€â”€ Restore â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleRestoreRole = useCallback(async (role: Role) => {
    try {
      const restored = await apiFetch<Role>(`${BASE}/${role.id}/restore`, { method: 'PATCH' });
      showToast(`Role "${restored.name}" berhasil dipulihkan`);
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [showToast]);

  // â”€â”€ Search / filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSearch = useCallback((search: string) => {
    setQuery(q => ({ ...q, search: search || undefined, page: 1 }));
  }, []);

  const handleFilterActive = useCallback((isActive?: boolean) => {
    setQuery(q => ({ ...q, isActive, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery(q => ({ ...q, page }));
  }, []);

  return {
    // Data
    collection,
    selectedRole,
    query,
    // Loading
    listLoading,
    detailLoading,
    saving,
    // Modals
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    editingRole,
    deletingRole,
    // Toast
    toast,
    // Handlers
    onSelectRole:         handleSelectRole,
    onPermissionsChange:  (updated: Role) => setSelectedRole(updated),
    onSavePermissions:    handleSavePermissions,
    onToggleStatus:       handleToggleStatus,
    onOpenCreateModal:    () => setShowCreateModal(true),
    onCloseCreateModal:   () => setShowCreateModal(false),
    onCreateRole:         handleCreateRole,
    onOpenEditModal:      (role: Role) => { setEditingRole(role); setShowEditModal(true); },
    onCloseEditModal:     () => { setShowEditModal(false); setEditingRole(null); },
    onUpdateRole:         handleUpdateRole,
    onOpenDeleteConfirm:  (role: Role) => { setDeletingRole(role); setShowDeleteConfirm(true); },
    onCloseDeleteConfirm: () => { setShowDeleteConfirm(false); setDeletingRole(null); },
    onDeleteRole:         handleDeleteRole,
    onRestoreRole:        handleRestoreRole,
    onSearch:             handleSearch,
    onFilterActive:       handleFilterActive,
    onPageChange:         handlePageChange,
    onRefresh:            () => setQuery(q => ({ ...q })),
  };
};


