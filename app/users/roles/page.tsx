'use client';

import { useRoleManagement } from '@/src/presentation/hooks/user/useRoleManagement';
import { RoleManagementTemplate } from '@/src/presentation/components/templates/RoleManagementTemplate';

export default function RolesPage() {
  const {
    allRoles,
    activeRole,
    permissions,
    loading,
    saving,
    toast,
    onTabChange,
    onPermissionsChange,
    onSave,
  } = useRoleManagement();

  return (
    <RoleManagementTemplate
      allRoles={allRoles}
      activeRole={activeRole}
      permissions={permissions}
      loading={loading}
      saving={saving}
      toast={toast}
      onTabChange={onTabChange}
      onPermissionsChange={onPermissionsChange}
      onSave={onSave}
    />
  );
}
