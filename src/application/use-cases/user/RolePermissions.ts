/**
 * Use Cases: Role Permissions
 */
import { RolePermissions, UserRole } from '@/src/domain/entities/User';
import { IUserRepository } from '@/src/domain/repositories/IUserRepository';

export class GetRolePermissionsUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(role: UserRole): Promise<RolePermissions> {
    return this.repo.getRolePermissions(role);
  }
}

export class UpdateRolePermissionsUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(permissions: RolePermissions): Promise<RolePermissions> {
    return this.repo.updateRolePermissions(permissions);
  }
}
