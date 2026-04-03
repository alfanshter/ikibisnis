/**
 * Domain Entity: User Management
 * Field names match the backend REST API exactly.
 */

// ── API types (backend contract) ───────────────────────────────────────────

export type Gender = 'male' | 'female';

/** Role summary embedded inside every User response */
export interface UserRoleSummary {
  id:         string;
  name:       string;
  badgeColor: string;
}

/** Full user object as returned by GET /api/v1/users and GET /api/v1/users/:id */
export interface ApiUser {
  id:           string;
  fullName:     string;
  email:        string;
  phone:        string;
  address:      string;
  gender:       Gender;
  birthPlace?:  string;
  birthDate?:   string;   // ISO date YYYY-MM-DD
  nik?:         string;   // 16 digit
  npwp?:        string;   // 15 digit
  isActive:     boolean;
  roleId:       string;
  roleName:     string;
  lastLoginAt?: string | null;
  createdAt:    string;
  updatedAt:    string;
}

/** POST /api/v1/users */
export interface CreateUserApiDTO {
  fullName:        string;
  email:           string;
  roleId:          string;
  password:        string;
  confirmPassword: string;
  phone:           string;
  address:         string;
  gender:          Gender;
  birthPlace?:     string;
  birthDate?:      string;
  nik?:            string;
  npwp?:           string;
}

/** PUT /api/v1/users/:id */
export interface UpdateUserApiDTO {
  fullName?:   string;
  phone?:      string;
  address?:    string;
  gender?:     Gender;
  birthPlace?: string;
  birthDate?:  string;
  nik?:        string;
  npwp?:       string;
  roleId?:     string;
}

/** PATCH /api/v1/users/:id/change-password */
export interface ChangePasswordDTO {
  currentPassword?: string;
  newPassword:      string;
  confirmPassword:  string;
}

/** Query params for GET /api/v1/users */
export interface GetUsersQuery {
  page?:     number;
  limit?:    number;
  search?:   string;
  isActive?: boolean;
  gender?:   Gender;
  roleId?:   string;
}

/** Paginated collection returned by GET /api/v1/users */
export interface ApiUserCollection {
  data:       ApiUser[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

/** Generic API envelope (same pattern as roles) */
export interface ApiResponse<T = unknown> {
  success:    boolean;
  statusCode: number;
  message:    string;
  data?:      T;
  timestamp:  string;
  path:       string;
}

// ── Role Permissions ──────────────────────────────────────────────────────

export type PermissionAction = 'read' | 'write' | 'delete';

export interface ModulePermission {
  module:      string;
  label?:      string;
  icon?:       string;
  permissions: Record<PermissionAction, boolean>;
}

export interface RolePermissions {
  role:    UserRole;
  modules: ModulePermission[];
}

// ── Legacy types — kept only to avoid breaking untouched molecules ─────────

export type UserRole     = 'Admin' | 'Manager' | 'Staff';
export type UserStatus   = 'Active' | 'Inactive';
export type JenisKelamin = 'Laki-laki' | 'Perempuan';

export interface UserAvatar {
  initials:  string;
  bgColor:   string;
  imageUrl?: string;
}

/** @deprecated Use ApiUser instead */
export interface User {
  id:            string;
  name:          string;
  email:         string;
  role:          UserRole;
  status:        UserStatus;
  lastLogin:     Date;
  avatar:        UserAvatar;
  phone?:        string;
  address?:      string;
  jenis_kelamin?: JenisKelamin;
  tanggal_lahir?: string;
  tempat_lahir?:  string;
  no_ktp?:        string;
  npwp?:          string;
}

/** @deprecated Use CreateUserApiDTO instead */
export interface CreateUserDTO {
  name:          string;
  email:         string;
  role:          UserRole;
  password:      string;
  phone?:        string;
  address?:      string;
  jenis_kelamin?: JenisKelamin;
  tanggal_lahir?: string;
  tempat_lahir?:  string;
  no_ktp?:        string;
  npwp?:          string;
}

/** @deprecated Use UpdateUserApiDTO instead */
export interface UpdateUserDTO {
  id:            string;
  name?:         string;
  email?:        string;
  role?:         UserRole;
  status?:       UserStatus;
  phone?:        string;
  address?:      string;
  jenis_kelamin?: JenisKelamin;
  tanggal_lahir?: string;
  tempat_lahir?:  string;
  no_ktp?:        string;
  npwp?:          string;
}

export interface UserPagination {
  currentPage: number;
  totalPages:  number;
  totalUsers:  number;
  perPage:     number;
}

/** @deprecated Use ApiUserCollection instead */
export class UserCollection {
  constructor(
    public readonly users: User[],
    public readonly pagination: UserPagination
  ) {}
  getActiveUsers  = () => this.users.filter(u => u.status === 'Active');
  getUserById     = (id: string) => this.users.find(u => u.id === id);
  getUsersByRole  = (role: UserRole) => this.users.filter(u => u.role === role);
}
