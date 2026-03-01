/**
 * Domain Entity: User Management
 * Pure business logic entities without any framework dependencies
 */

export type UserRole = 'Admin' | 'Manager' | 'Staff';
export type UserStatus = 'Active' | 'Inactive';
export type PermissionAction = 'read' | 'write' | 'delete';

export interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface ModulePermission {
  module: string;
  label: string;
  icon: string;
  permissions: Permission;
}

export interface RolePermissions {
  role: UserRole;
  modules: ModulePermission[];
}

export interface UserAvatar {
  initials: string;
  bgColor: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: Date;
  avatar: UserAvatar;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserDTO {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  perPage: number;
}

export class UserCollection {
  constructor(
    public readonly users: User[],
    public readonly pagination: UserPagination
  ) {}

  getActiveUsers(): User[] {
    return this.users.filter(u => u.status === 'Active');
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUsersByRole(role: UserRole): User[] {
    return this.users.filter(u => u.role === role);
  }
}
