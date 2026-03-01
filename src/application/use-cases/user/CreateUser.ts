/**
 * Use Case: Create User
 */
import { User, CreateUserDTO } from '@/src/domain/entities/User';
import { IUserRepository } from '@/src/domain/repositories/IUserRepository';

export class CreateUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    if (!dto.email.includes('@')) throw new Error('Format email tidak valid');
    if (!dto.name.trim())         throw new Error('Nama wajib diisi');
    return this.repo.createUser(dto);
  }
}
