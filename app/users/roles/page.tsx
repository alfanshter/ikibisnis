'use client';

import { useRoleManagement } from '@/src/presentation/hooks/user/useRoleManagement';
import { RoleManagementTemplate } from '@/src/presentation/components/templates/RoleManagementTemplate';
import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';

export default function RolesPage() {
  const state = useRoleManagement();

  return (
    <PermissionGuard feature="user_management_roles">
      <RoleManagementTemplate {...state} />
    </PermissionGuard>
  );
}
