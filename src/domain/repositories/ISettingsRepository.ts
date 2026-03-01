/**
 * Repository Interface: ISettingsRepository
 */
import { AppSettings, UserProfile, AppearanceSettings, ChangePasswordDTO } from '@/src/domain/entities/Settings';

export interface ISettingsRepository {
  getStore():               Promise<AppSettings>;
  updateStore(s: AppSettings): Promise<AppSettings>;
  getProfile():             Promise<UserProfile>;
  updateProfile(p: UserProfile): Promise<UserProfile>;
  getAppearance():          Promise<AppearanceSettings>;
  updateAppearance(a: AppearanceSettings): Promise<AppearanceSettings>;
  changePassword(dto: ChangePasswordDTO): Promise<void>;
}
