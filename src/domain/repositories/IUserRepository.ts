/**
 * Domain Repository Interface: User Management
 * Defines contract for user data access without implementation details
 */

import {
  UserCollection,
  User,
  CreateUserDTO,
  UpdateUserDTO,
  RolePermissions,
  UserRole
} from '../entities/User';

export interface IUserRepository {
  getUsers(page: number, perPage: number): Promise<UserCollection>;
  getUserById(id: string): Promise<User | null>;
  createUser(dto: CreateUserDTO): Promise<User>;
  updateUser(dto: UpdateUserDTO): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getRolePermissions(role: UserRole): Promise<RolePermissions>;
  updateRolePermissions(permissions: RolePermissions): Promise<RolePermissions>;
}
