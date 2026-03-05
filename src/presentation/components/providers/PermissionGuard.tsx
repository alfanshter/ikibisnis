/**
 * Component: PermissionGuard
 * Wraps a page and redirects to /403 if the user lacks 'read' on the given feature.
 * Also shows a 403 screen for other actions (write/update/delete) when needed.
 *
 * Usage:
 *   <PermissionGuard feature="user_management_users">
 *     <UsersPage />
 *   </PermissionGuard>
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/src/presentation/hooks/auth/usePermission';
import type { SystemFeature } from '@/src/domain/entities/Role';

interface PermissionGuardProps {
  feature:  SystemFeature;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ feature, children }) => {
  const { canRead } = usePermission(feature);
  const router = useRouter();

  useEffect(() => {
    if (!canRead) router.replace('/403');
  }, [canRead, router]);

  if (!canRead) {
    // Render nothing while redirecting
    return null;
  }

  return <>{children}</>;
};
