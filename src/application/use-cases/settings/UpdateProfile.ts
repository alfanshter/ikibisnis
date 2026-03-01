/**
 * Use Case: Update User Profile
 */
import { ISettingsRepository } from '@/src/domain/repositories/ISettingsRepository';
import { UserProfile } from '@/src/domain/entities/Settings';

export class UpdateProfileUseCase {
  constructor(private repo: ISettingsRepository) {}

  async execute(p: UserProfile) {
    if (!p.name.trim())  throw new Error('Nama tidak boleh kosong');
    if (!p.email.trim()) throw new Error('Email tidak boleh kosong');
    return this.repo.updateProfile(p);
  }
}
