/**
 * Hook: useUserManagement
 * All operations go through the real /api/v1/users REST API.
 * Pattern mirrors useRoleManagement: hook â†’ fetch â†’ backend.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ApiUser,
  ApiUserCollection,
  CreateUserApiDTO,
  UpdateUserApiDTO,
  ChangePasswordDTO,
  GetUsersQuery,
} from '@/src/domain/entities/User';
import { apiFetch } from '@/src/infrastructure/api/apiFetch';

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BASE    = `/api/proxy/v1/users`;

// â”€â”€ Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface ToastState { msg: string; type: 'success' | 'error' }

// â”€â”€ Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const useUserManagement = () => {
  // â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [collection,        setCollection]        = useState<ApiUserCollection | null>(null);
  const [listLoading,       setListLoading]        = useState(true);
  const [saving,            setSaving]             = useState(false);
  const [toast,             setToast]              = useState<ToastState | null>(null);
  const [query,             setQuery]              = useState<GetUsersQuery>({ page: 1, limit: 10 });

  // Modal state
  const [showCreateModal,       setShowCreateModal]       = useState(false);
  const [showEditModal,         setShowEditModal]         = useState(false);
  const [showDeleteConfirm,     setShowDeleteConfirm]     = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [editingUser,           setEditingUser]           = useState<ApiUser | null>(null);
  const [deletingUser,          setDeletingUser]          = useState<ApiUser | null>(null);
  const [passwordUser,          setPasswordUser]          = useState<ApiUser | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // â”€â”€ Toast helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const showToast = useCallback((msg: string, type: ToastState['type'] = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // â”€â”€ Fetch list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchUsers = useCallback(async (q: GetUsersQuery) => {
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
      if (q.gender)                sp.set('gender',   q.gender);
      if (q.roleId)                sp.set('roleId',   q.roleId);

      const data = await apiFetch<ApiUserCollection>(
        `${BASE}?${sp.toString()}`,
        { signal: ctrl.signal }
      );
      setCollection(data);
    } catch (err) {
      if ((err as Error).name !== 'AbortError')
        showToast((err as Error).message, 'error');
    } finally {
      setListLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchUsers(query); }, [query, fetchUsers]);

  // â”€â”€ Create â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreate = useCallback(async (dto: CreateUserApiDTO) => {
    setSaving(true);
    try {
      const user = await apiFetch<ApiUser>(BASE, {
        method: 'POST',
        body:   JSON.stringify(dto),
      });
      setShowCreateModal(false);
      showToast(`Pengguna "${user.fullName}" berhasil dibuat`);
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  // â”€â”€ Update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleUpdate = useCallback(async (id: string, dto: UpdateUserApiDTO) => {
    setSaving(true);
    try {
      const user = await apiFetch<ApiUser>(`${BASE}/${id}`, {
        method: 'PUT',
        body:   JSON.stringify(dto),
      });
      setShowEditModal(false);
      setEditingUser(null);
      showToast(`Pengguna "${user.fullName}" berhasil diperbarui`);
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  // â”€â”€ Change password â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleChangePassword = useCallback(async (id: string, dto: ChangePasswordDTO) => {
    setSaving(true);
    try {
      await apiFetch<{ message: string }>(`${BASE}/${id}/change-password`, {
        method: 'PATCH',
        body:   JSON.stringify(dto),
      });
      setShowChangePasswordModal(false);
      setPasswordUser(null);
      showToast('Password berhasil diubah');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  // â”€â”€ Toggle status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleToggleStatus = useCallback(async (user: ApiUser) => {
    try {
      const updated = await apiFetch<ApiUser>(`${BASE}/${user.id}/toggle-status`, {
        method: 'PATCH',
      });
      showToast(`${updated.fullName} berhasil di${updated.isActive ? 'aktifkan' : 'nonaktifkan'}`);
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [showToast]);

  // â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDelete = useCallback(async () => {
    if (!deletingUser) return;
    setSaving(true);
    try {
      await apiFetch<{ message: string }>(`${BASE}/${deletingUser.id}`, { method: 'DELETE' });
      showToast(`Pengguna "${deletingUser.fullName}" berhasil dihapus`);
      setShowDeleteConfirm(false);
      setDeletingUser(null);
      setQuery(q => ({ ...q }));
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [deletingUser, showToast]);

  // â”€â”€ Query helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handlePageChange   = (page: number)   => setQuery(q => ({ ...q, page }));
  const handleSearchChange = (search: string) => setQuery(q => ({ ...q, search: search || undefined, page: 1 }));
  const handleFilterChange = (patch: Partial<GetUsersQuery>) => setQuery(q => ({ ...q, ...patch, page: 1 }));

  // â”€â”€ Modal openers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openCreate          = ()           => setShowCreateModal(true);
  const openEdit            = (u: ApiUser) => { setEditingUser(u); setShowEditModal(true); };
  const openDeleteConfirm   = (u: ApiUser) => { setDeletingUser(u); setShowDeleteConfirm(true); };
  const openChangePassword  = (u: ApiUser) => { setPasswordUser(u); setShowChangePasswordModal(true); };

  const closeCreate         = () => setShowCreateModal(false);
  const closeEdit           = () => { setShowEditModal(false); setEditingUser(null); };
  const closeDeleteConfirm  = () => { setShowDeleteConfirm(false); setDeletingUser(null); };
  const closeChangePassword = () => { setShowChangePasswordModal(false); setPasswordUser(null); };

  return {
    // data
    collection, query, listLoading, saving, toast,
    // modal state
    showCreateModal, showEditModal, showDeleteConfirm, showChangePasswordModal,
    editingUser, deletingUser, passwordUser,
    // actions
    handleCreate, handleUpdate, handleChangePassword,
    handleToggleStatus, handleDelete,
    // query
    handlePageChange, handleSearchChange, handleFilterChange,
    // modal open/close
    openCreate, openEdit, openDeleteConfirm, openChangePassword,
    closeCreate, closeEdit, closeDeleteConfirm, closeChangePassword,
  };
};


