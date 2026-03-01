/**
 * Use Case: Update Store Settings
 */
import { ISettingsRepository } from '@/src/domain/repositories/ISettingsRepository';
import { AppSettings } from '@/src/domain/entities/Settings';

export class UpdateStoreUseCase {
  constructor(private repo: ISettingsRepository) {}

  async execute(s: AppSettings) {
    if (!s.storeName.trim())   throw new Error('Nama toko tidak boleh kosong');
    if (!s.logoInitial.trim()) throw new Error('Inisial logo tidak boleh kosong');
    return this.repo.updateStore(s);
  }
}
