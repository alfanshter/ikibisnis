/**
 * Infrastructure: SettingsRepository
 * In-memory singleton — persists for the session lifetime.
 */
import { ISettingsRepository } from '@/src/domain/repositories/ISettingsRepository';
import {
  AppSettings, UserProfile, AppearanceSettings, ChangePasswordDTO,
  DEFAULT_STORE, DEFAULT_PROFILE, DEFAULT_APPEARANCE,
} from '@/src/domain/entities/Settings';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// Mutable session state
let store:      AppSettings       = { ...DEFAULT_STORE };
let profile:    UserProfile       = { ...DEFAULT_PROFILE };
let appearance: AppearanceSettings = { ...DEFAULT_APPEARANCE };
let hashedPw    = 'admin123'; // demo password

export class SettingsRepository implements ISettingsRepository {
  async getStore()  { await delay(); return { ...store }; }
  async getProfile(){ await delay(); return { ...profile }; }
  async getAppearance() { await delay(); return { ...appearance }; }

  async updateStore(s: AppSettings) {
    await delay(400);
    store = { ...s };
    return { ...store };
  }

  async updateProfile(p: UserProfile) {
    await delay(400);
    profile = { ...p };
    return { ...profile };
  }

  async updateAppearance(a: AppearanceSettings) {
    await delay(400);
    appearance = { ...a };
    return { ...appearance };
  }

  async changePassword(dto: ChangePasswordDTO) {
    await delay(500);
    if (dto.currentPassword !== hashedPw) {
      throw new Error('Password saat ini salah');
    }
    hashedPw = dto.newPassword;
  }
}
