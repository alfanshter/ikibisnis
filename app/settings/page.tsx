'use client';
import React from 'react';
import { SettingsTemplate } from '@/src/presentation/templates/SettingsTemplate';
import { useSettings } from '@/src/presentation/hooks/settings/useSettings';
import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';

export default function SettingsPage() {
  const props = useSettings();
  return (
    <PermissionGuard feature="settings">
      <SettingsTemplate {...props} />
    </PermissionGuard>
  );
}
