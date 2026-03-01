/**
 * Use Case: Update User
 */
import { User, UpdateUserDTO } from '@/src/domain/entities/User';
import { IUserRepository } from '@/src/domain/repositories/IUserRepository';

export class UpdateUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(dto: UpdateUserDTO): Promise<User> {
    if (!dto.id) throw new Error('User ID wajib diisi');
    return this.repo.updateUser(dto);
  }
}
