/**
 * Use Case: Get Users (paginated)
 */
import { UserCollection } from '@/src/domain/entities/User';
import { IUserRepository } from '@/src/domain/repositories/IUserRepository';

export class GetUsersUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(page = 1, perPage = 4): Promise<UserCollection> {
    return this.repo.getUsers(page, perPage);
  }
}
