/**
 * Domain Entity: User Management
 * Pure business logic entities without any framework dependencies
 */

export type UserRole = 'Admin' | 'Manager' | 'Staff';
export type UserStatus = 'Active' | 'Inactive';
export type PermissionAction = 'read' | 'write' | 'delete';
export type JenisKelamin = 'Laki-laki' | 'Perempuan';

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
  // Extended profile fields
  phone?: string;
  address?: string;
  jenis_kelamin?: JenisKelamin;
  tanggal_lahir?: string;   // ISO date string: YYYY-MM-DD
  tempat_lahir?: string;
  no_ktp?: string;          // optional
  npwp?: string;            // optional
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  phone?: string;
  address?: string;
  jenis_kelamin?: JenisKelamin;
  tanggal_lahir?: string;
  tempat_lahir?: string;
  no_ktp?: string;
  npwp?: string;
}

export interface UpdateUserDTO {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  phone?: string;
  address?: string;
  jenis_kelamin?: JenisKelamin;
  tanggal_lahir?: string;
  tempat_lahir?: string;
  no_ktp?: string;
  npwp?: string;
}

// Color palette available when creating a custom role
export type RoleColor =
  | 'red' | 'orange' | 'amber' | 'yellow'
  | 'lime' | 'emerald' | 'teal' | 'cyan'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'pink';

export interface CreateRoleDTO {
  name: string;           // e.g. "Supervisor"
  description: string;    // short description
  color: RoleColor;       // badge/ring color
  defaultPermissions: {   // initial permission matrix
    read: boolean;
    write: boolean;
    delete: boolean;
  };
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
