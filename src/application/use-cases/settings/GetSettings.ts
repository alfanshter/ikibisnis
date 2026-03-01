/**
 * Use Case: Get Settings
 */
import { ISettingsRepository } from '@/src/domain/repositories/ISettingsRepository';

export class GetSettingsUseCase {
  constructor(private repo: ISettingsRepository) {}

  async executeStore()      { return this.repo.getStore(); }
  async executeProfile()    { return this.repo.getProfile(); }
  async executeAppearance() { return this.repo.getAppearance(); }
}
