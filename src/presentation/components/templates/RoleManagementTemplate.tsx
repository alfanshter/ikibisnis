/**
 * Template: RoleManagementTemplate
 * Two-panel layout matching reference design:
 * - Left: Active Roles list (card per role)
 * - Right: Permission Matrix with Read/Write/Delete toggles
 */

'use client';

import React from 'react';
import { RolePermissions, UserRole, PermissionAction } from '@/src/domain/entities/User';
import { Sidebar } from '../organisms/Sidebar';
import { TopBar } from '../organisms/TopBar';
import { Icon } from '../atoms/Icon';

const MODULE_ICON_MAP: Record<string, string> = {
  project_access:    'briefcase',
  financial_reports: 'dollar',
  user_management:   'users',
};

const ROLE_META: Record<UserRole, { icon: string; color: string; ring: string; badge: string; desc: string }> = {
  Admin: {
    icon:  'shield',
    color: 'text-red-400',
    ring:  'border-red-500/40',
    badge: 'bg-red-500/15 text-red-400',
    desc:  'Akses penuh ke semua fitur sistem',
  },
  Manager: {
    icon:  'users',
    color: 'text-blue-400',
    ring:  'border-blue-500/40',
    badge: 'bg-blue-500/15 text-blue-400',
    desc:  'Akses baca & tulis, tanpa hak hapus',
  },
  Staff: {
    icon:  'user',
    color: 'text-emerald-400',
    ring:  'border-emerald-500/40',
    badge: 'bg-emerald-500/15 text-emerald-400',
    desc:  'Akses terbatas hanya baca',
  },
};

const ROLE_USER_COUNT: Record<UserRole, number> = {
  Admin:   4,
  Manager: 12,
  Staff:   32,
};

/* ─── Toggle Switch ─────────────────────────────────────────── */
interface ToggleProps {
  checked:   boolean;
  onChange:  (v: boolean) => void;
  disabled?: boolean;
}
const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${
      checked ? 'bg-blue-500' : 'bg-slate-600/60'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block w-4 h-4 mt-0.5 ml-0.5 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

/* ─── Props ──────────────────────────────────────────────────── */
interface RoleManagementTemplateProps {
  allRoles:            UserRole[];
  activeRole:          UserRole;
  permissions:         RolePermissions | null;
  loading:             boolean;
  saving:              boolean;
  toast:               { msg: string; type: 'success' | 'error' } | null;
  onTabChange:         (role: UserRole) => void;
  onPermissionsChange: (updated: RolePermissions) => void;
  onSave:              () => void;
}

/* ─── Template ───────────────────────────────────────────────── */
export const RoleManagementTemplate: React.FC<RoleManagementTemplateProps> = ({
  allRoles,
  activeRole,
  permissions,
  loading,
  saving,
  toast,
  onTabChange,
  onPermissionsChange,
  onSave,
}) => {
  const activeMeta = ROLE_META[activeRole];

  const handleToggle = (moduleKey: string, action: PermissionAction, value: boolean) => {
    if (!permissions) return;
    onPermissionsChange({
      ...permissions,
      modules: permissions.modules.map(mod =>
        mod.module === moduleKey
          ? { ...mod, permissions: { ...mod.permissions, [action]: value } }
          : mod,
      ),
    });
  };

  const ACTIONS: { key: PermissionAction; label: string }[] = [
    { key: 'read',   label: 'Read'   },
    { key: 'write',  label: 'Write'  },
    { key: 'delete', label: 'Delete' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activePage="User Management" />

      <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8">
        <TopBar
          title="Roles & Permissions"
          subtitle="Kelola hak akses setiap role terhadap modul-modul yang tersedia."
        />

        <div className="flex gap-6 items-start mt-8">

          {/* ── Left Panel: Role List ── */}
          <div className="w-72 shrink-0 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Roles</p>
            </div>

            {allRoles.map(role => {
              const meta     = ROLE_META[role];
              const isActive = role === activeRole;
              return (
                <button
                  key={role}
                  onClick={() => onTabChange(role)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                    isActive
                      ? `bg-blue-500/10 ${meta.ring} border-current`
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? meta.badge : 'bg-slate-700/50'
                  }`}>
                    <Icon name={meta.icon} className={`w-5 h-5 ${isActive ? meta.color : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>{role}</p>
                    <p className="text-slate-500 text-xs">{ROLE_USER_COUNT[role]} Users assigned</p>
                  </div>
                  {isActive
                    ? <Icon name="check" className="w-5 h-5 text-blue-400 shrink-0" />
                    : <Icon name="chevron-right" className="w-4 h-4 text-slate-600 shrink-0" />
                  }
                </button>
              );
            })}

            {/* Create new role — dashed */}
            <button className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-slate-600/50 text-slate-500 hover:text-slate-300 hover:border-slate-500 text-sm transition-all">
              <Icon name="plus" className="w-4 h-4" />
              Create New Role
            </button>
          </div>

          {/* ── Right Panel: Permission Matrix ── */}
          <div className="flex-1 min-w-0 bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">

            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-slate-700/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Permission Matrix</p>
                  <h2 className="text-white font-bold text-lg">
                    <span className={activeMeta.color}>{activeRole}</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">
                    Configure access levels for each module for the {activeRole} role.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    className="px-4 py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all border border-slate-600/50"
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={onSave}
                    disabled={saving || loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    {saving
                      ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Icon name="check" className="w-4 h-4" />
                    }
                    Save Permissions
                  </button>
                </div>
              </div>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-[1fr_repeat(3,90px)] gap-x-2 px-6 py-3 border-b border-slate-700/30">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Module</p>
              {ACTIONS.map(a => (
                <p key={a.key} className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                  {a.label}
                </p>
              ))}
            </div>

            {/* Permission Rows */}
            {loading ? (
              <div className="p-10 flex justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="divide-y divide-slate-700/20">
                {permissions?.modules.map(mod => (
                  <div
                    key={mod.module}
                    className="grid grid-cols-[1fr_repeat(3,90px)] gap-x-2 px-6 py-4 items-center hover:bg-slate-700/10 transition-colors"
                  >
                    {/* Module name */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-700/60 rounded-lg flex items-center justify-center shrink-0">
                        <Icon name={MODULE_ICON_MAP[mod.module] || 'grid'} className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{mod.label}</p>
                        <p className="text-slate-500 text-xs">{mod.module.replace(/_/g, ' ')}</p>
                      </div>
                    </div>

                    {/* Toggles */}
                    {ACTIONS.map(a => {
                      const val = mod.permissions[a.key as keyof typeof mod.permissions] as boolean;
                      return (
                        <div key={a.key} className="flex justify-center">
                          <Toggle
                            checked={val}
                            onChange={v => handleToggle(mod.module, a.key, v)}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-700/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Icon name="warning" className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>{activeRole}s tidak dapat menghapus proyek secara default.</span>
              </div>
              <p className="text-slate-600 text-xs uppercase tracking-widest">Last Modified: Mar 1, 2026</p>
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
          toast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <Icon name={toast.type === 'success' ? 'check' : 'x'} className="w-4 h-4" />
          {toast.msg}
        </div>
      )}
    </div>
  );
};
