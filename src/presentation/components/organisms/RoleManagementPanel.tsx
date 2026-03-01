/**
 * Organism Component: RoleManagementPanel
 * Slide-in panel for viewing/editing role permissions
 */

'use client';

import React from 'react';
import { RolePermissions, PermissionAction } from '@/src/domain/entities/User';
import { Icon } from '../atoms/Icon';
import { PermissionCheckbox } from '../molecules/PermissionCheckbox';

interface RoleManagementPanelProps {
  permissions: RolePermissions;
  onClose:  () => void;
  onChange: (updated: RolePermissions) => void;
  onSave:   () => void;
  saving?:  boolean;
}

const MODULE_ICON_MAP: Record<string, string> = {
  project_access:    'briefcase',
  financial_reports: 'dollar',
  user_management:   'users'
};

export const RoleManagementPanel: React.FC<RoleManagementPanelProps> = ({
  permissions,
  onClose,
  onChange,
  onSave,
  saving = false
}) => {
  const handlePermissionChange = (
    moduleKey: string,
    action: PermissionAction,
    value: boolean
  ) => {
    const updated: RolePermissions = {
      ...permissions,
      modules: permissions.modules.map(mod =>
        mod.module === moduleKey
          ? { ...mod, permissions: { ...mod.permissions, [action]: value } }
          : mod
      )
    };
    onChange(updated);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden h-fit">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-slate-700/50">
        <div>
          <h3 className="text-white font-bold text-base">Role Management</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Configuring: {permissions.role} Role
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
        >
          <Icon name="x" className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
          Module Permissions
        </p>

        {permissions.modules.map(mod => (
          <div key={mod.module} className="space-y-2">
            {/* Module header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 text-slate-400">
                <Icon name={MODULE_ICON_MAP[mod.module] || 'grid'} className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">
                {mod.label}
              </span>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-2 pl-7">
              <PermissionCheckbox
                label="Read"
                checked={mod.permissions.read}
                onChange={v => handlePermissionChange(mod.module, 'read', v)}
              />
              <PermissionCheckbox
                label="Write"
                checked={mod.permissions.write}
                onChange={v => handlePermissionChange(mod.module, 'write', v)}
              />
              <PermissionCheckbox
                label="Del"
                checked={mod.permissions.delete}
                onChange={v => handlePermissionChange(mod.module, 'delete', v)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
