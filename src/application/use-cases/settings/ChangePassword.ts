/**
 * Use Case: Change Password
 */
import { ISettingsRepository } from '@/src/domain/repositories/ISettingsRepository';
import { ChangePasswordDTO } from '@/src/domain/entities/Settings';

export class ChangePasswordUseCase {
  constructor(private repo: ISettingsRepository) {}

  async execute(dto: ChangePasswordDTO) {
    if (!dto.currentPassword)              throw new Error('Password saat ini wajib diisi');
    if (dto.newPassword.length < 8)        throw new Error('Password baru minimal 8 karakter');
    if (dto.newPassword !== dto.confirmPassword) throw new Error('Konfirmasi password tidak cocok');
    return this.repo.changePassword(dto);
  }
}
