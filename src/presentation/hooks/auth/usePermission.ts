/**
 * Hook: usePermission
 * Reads the permissions stored in the session after login and exposes
 * helper functions to check what the current user is allowed to do.
 *
 * Usage:
 *   const { canRead, canWrite, canUpdate, canDelete } = usePermission('user_management_users');
 *   if (!canRead) redirect('/403');
 *   {canWrite && <button>Tambah</button>}
 */

'use client';

import { useMemo } from 'react';
import { getSession } from './useAuth';
import type { SystemFeature, FeatureAction } from '@/src/domain/entities/Role';

export const usePermission = (feature: SystemFeature) => {
  const actions = useMemo<FeatureAction[]>(() => {
    const session = getSession();
    if (!session || !session.permissions?.length) return [];
    const perm = session.permissions.find(p => p.feature === feature);
    return perm?.actions ?? [];
  }, [feature]);

  return {
    canRead:   actions.includes('read'),
    canWrite:  actions.includes('write'),
    canUpdate: actions.includes('update'),
    canDelete: actions.includes('delete'),
    actions,
  };
};

/**
 * Check a single action directly (without the hook, for non-component use).
 * e.g. in Server Components or utility functions.
 */
export const hasPermission = (
  feature: SystemFeature,
  action:  FeatureAction,
): boolean => {
  const session = getSession();
  if (!session || !session.permissions?.length) return false;
  const perm = session.permissions.find(p => p.feature === feature);
  return perm?.actions.includes(action) ?? false;
};
