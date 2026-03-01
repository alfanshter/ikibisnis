'use client';
import React from 'react';
import { SettingsTemplate } from '@/src/presentation/templates/SettingsTemplate';
import { useSettings } from '@/src/presentation/hooks/settings/useSettings';

export default function SettingsPage() {
  const props = useSettings();
  return <SettingsTemplate {...props} />;
}
