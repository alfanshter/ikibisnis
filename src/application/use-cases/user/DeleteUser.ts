/**
 * Use Case: Delete User
 */
import { IUserRepository } from '@/src/domain/repositories/IUserRepository';

export class DeleteUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) throw new Error('User ID wajib diisi');
    return this.repo.deleteUser(id);
  }
}
