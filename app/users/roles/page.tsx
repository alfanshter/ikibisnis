'use client';

import { useRoleManagement } from '@/src/presentation/hooks/user/useRoleManagement';
import { RoleManagementTemplate } from '@/src/presentation/components/templates/RoleManagementTemplate';

export default function RolesPage() {
  const state = useRoleManagement();

  return <RoleManagementTemplate {...state} />;
}
