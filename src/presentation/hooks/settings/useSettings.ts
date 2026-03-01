/**
 * Hook: useSettings
 * Manages all settings state and side-effects.
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import DIContainer from '@/src/infrastructure/di/container';
import {
  AppSettings, UserProfile, AppearanceSettings, ChangePasswordDTO,
  DEFAULT_STORE, DEFAULT_PROFILE, DEFAULT_APPEARANCE,
} from '@/src/domain/entities/Settings';

export type SettingsTab = 'toko' | 'profil' | 'keamanan' | 'tampilan';

export const useSettings = () => {
  const container = DIContainer.getInstance();
  const getUC     = container.getGetSettingsUseCase();
  const storeUC   = container.getUpdateStoreUseCase();
  const profileUC = container.getUpdateProfileUseCase();
  const appearUC  = container.getUpdateAppearanceUseCase();
  const pwUC      = container.getChangePasswordUseCase();

  /* ── Data ── */
  const [store,      setStore]      = useState<AppSettings>(DEFAULT_STORE);
  const [profile,    setProfile]    = useState<UserProfile>(DEFAULT_PROFILE);
  const [appearance, setAppearance] = useState<AppearanceSettings>(DEFAULT_APPEARANCE);

  /* ── UI ── */
  const [activeTab,  setActiveTab]  = useState<SettingsTab>('toko');
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [pwApiError, setPwApiError] = useState<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Load ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, p, a] = await Promise.all([
        getUC.executeStore(),
        getUC.executeProfile(),
        getUC.executeAppearance(),
      ]);
      setStore(s);
      setProfile(p);
      setAppearance(a);
    } finally {
      setLoading(false);
    }
  }, [getUC]);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── Save handlers ── */
  const handleSaveStore = async (s: AppSettings) => {
    setSaving(true);
    try {
      const updated = await storeUC.execute(s);
      setStore(updated);
      showToast('Pengaturan toko berhasil disimpan');
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (p: UserProfile) => {
    setSaving(true);
    try {
      const updated = await profileUC.execute(p);
      setProfile(updated);
      showToast('Profil berhasil diperbarui');
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAppearance = async (a: AppearanceSettings) => {
    setSaving(true);
    try {
      const updated = await appearUC.execute(a);
      setAppearance(updated);
      showToast('Tampilan berhasil diperbarui');
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (dto: ChangePasswordDTO) => {
    setSaving(true);
    setPwApiError(null);
    try {
      await pwUC.execute(dto);
      showToast('Password berhasil diubah');
    } catch (e) {
      const msg = (e as Error).message;
      setPwApiError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    store, profile, appearance,
    activeTab, setActiveTab,
    loading, saving,
    toast, pwApiError,
    onSaveStore:      handleSaveStore,
    onSaveProfile:    handleSaveProfile,
    onSaveAppearance: handleSaveAppearance,
    onChangePassword: handleChangePassword,
  };
};
