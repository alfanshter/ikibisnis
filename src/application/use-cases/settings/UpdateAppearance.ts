/**
 * Use Case: Update Appearance Settings
 */
import { ISettingsRepository } from '@/src/domain/repositories/ISettingsRepository';
import { AppearanceSettings } from '@/src/domain/entities/Settings';

export class UpdateAppearanceUseCase {
  constructor(private repo: ISettingsRepository) {}

  async execute(a: AppearanceSettings) {
    return this.repo.updateAppearance(a);
  }
}
