/**
 * Template: SettingsTemplate
 * Full Settings page layout with tabbed sections.
 */
'use client';
import React from 'react';
import { Sidebar } from '@/src/presentation/components/organisms/Sidebar';
import { TopBar } from '@/src/presentation/components/organisms/TopBar';
import { StoreSettingsForm } from '@/src/presentation/components/organisms/StoreSettingsForm';
import { ProfileSettingsForm } from '@/src/presentation/components/organisms/ProfileSettingsForm';
import { SecuritySettingsForm } from '@/src/presentation/components/organisms/SecuritySettingsForm';
import { AppearanceSettingsForm } from '@/src/presentation/components/organisms/AppearanceSettingsForm';
import { Icon } from '@/src/presentation/components/atoms/Icon';
import {
  AppSettings, UserProfile, AppearanceSettings, ChangePasswordDTO,
} from '@/src/domain/entities/Settings';
import { SettingsTab } from '@/src/presentation/hooks/settings/useSettings';

const TABS: { key: SettingsTab; label: string; icon: string }[] = [
  { key: 'toko',     label: 'Toko',     icon: 'store'   },
  { key: 'profil',   label: 'Profil',   icon: 'user'    },
  { key: 'keamanan', label: 'Keamanan', icon: 'lock'    },
  { key: 'tampilan', label: 'Tampilan', icon: 'palette' },
];

interface Props {
  store:      AppSettings;
  profile:    UserProfile;
  appearance: AppearanceSettings;
  activeTab:  SettingsTab;
  setActiveTab: (t: SettingsTab) => void;
  loading:    boolean;
  saving:     boolean;
  toast:      { msg: string; type: 'success' | 'error' } | null;
  pwApiError: string | null;
  onSaveStore:      (s: AppSettings) => void;
  onSaveProfile:    (p: UserProfile) => void;
  onSaveAppearance: (a: AppearanceSettings) => void;
  onChangePassword: (dto: ChangePasswordDTO) => void;
}

export const SettingsTemplate: React.FC<Props> = ({
  store, profile, appearance,
  activeTab, setActiveTab,
  loading, saving,
  toast, pwApiError,
  onSaveStore, onSaveProfile, onSaveAppearance, onChangePassword,
}) => (
  <div className="flex min-h-screen bg-slate-950">
    <Sidebar />

    <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8 overflow-y-auto">
      <TopBar title="Pengaturan Sistem" subtitle="Kelola profil, toko, keamanan, dan tampilan aplikasi." />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-900/90 border border-emerald-500/40 text-emerald-300'
            : 'bg-red-900/90 border border-red-500/40 text-red-300'
        }`}>
          <Icon name={toast.type === 'success' ? 'check-circle' : 'alert-circle'} className="w-5 h-5" />
          {toast.msg}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <aside className="w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === t.key
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon name={t.icon} className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <button
              onClick={() => alert('Logout — tambahkan auth provider sesuai kebutuhan.')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
            >
              <Icon name="logout" className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'toko'     && <StoreSettingsForm      initial={store}      saving={saving} onSave={onSaveStore} />}
              {activeTab === 'profil'   && <ProfileSettingsForm    initial={profile}    saving={saving} onSave={onSaveProfile} />}
              {activeTab === 'keamanan' && <SecuritySettingsForm   saving={saving} onSave={onChangePassword} apiError={pwApiError} />}
              {activeTab === 'tampilan' && <AppearanceSettingsForm initial={appearance} saving={saving} onSave={onSaveAppearance} />}
            </>
          )}
        </div>
      </div>
    </main>
  </div>
);
