/**
 * Domain Entity: Role Management
 * Pure business logic — no framework dependencies.
 * Aligned with the API contract defined in the Postman collection.
 */

// ── Enums ─────────────────────────────────────────────────────────────────────

/**
 * All navigable features / menu pages in the application.
 * These are the only valid `feature` values that may appear in a permission.
 */
export const SYSTEM_FEATURES = [
  'dashboard',
  'user_management_roles',
  'user_management_users',
  'projects',
  'penawaran',
  'laporan_harian',
  'laporan_neraca',
  'laporan_laba_rugi',
  'laporan_arus_kas',
  'hutang_piutang',
  'settings',
] as const;

export type SystemFeature = (typeof SYSTEM_FEATURES)[number];

export const FEATURE_LABELS: Record<SystemFeature, string> = {
  dashboard:               'Dashboard',
  user_management_roles:   'User Management → Roles',
  user_management_users:   'User Management → Users',
  projects:                'Projects',
  penawaran:               'Penawaran (Quotation)',
  laporan_harian:          'Laporan Harian',
  laporan_neraca:          'Laporan Neraca',
  laporan_laba_rugi:       'Laporan Laba Rugi',
  laporan_arus_kas:        'Laporan Arus Kas',
  hutang_piutang:          'Hutang & Piutang',
  settings:                'Settings',
};

export const FEATURE_GROUPS: { group: string; features: SystemFeature[] }[] = [
  { group: 'General',      features: ['dashboard'] },
  { group: 'User Mgmt',   features: ['user_management_roles', 'user_management_users'] },
  { group: 'Operations',  features: ['projects', 'penawaran'] },
  { group: 'Laporan',     features: ['laporan_harian', 'laporan_neraca', 'laporan_laba_rugi', 'laporan_arus_kas', 'hutang_piutang'] },
  { group: 'System',      features: ['settings'] },
];

/** CRUD-like actions assignable to a feature. */
export type FeatureAction = 'read' | 'write' | 'update' | 'delete';
export const ALL_ACTIONS: FeatureAction[] = ['read', 'write', 'update', 'delete'];

// ── Core Types ────────────────────────────────────────────────────────────────

/** A single feature → actions mapping stored inside a Role. */
export interface RolePermission {
  feature: SystemFeature;
  actions: FeatureAction[];
}

/** Full Role entity as returned by the API. */
export interface Role {
  id: string;
  name: string;
  description: string;
  badgeColor: string;           // e.g. "#4F46E5"
  isActive: boolean;
  permissions: RolePermission[];
  createdAt: string;            // ISO-8601
  updatedAt: string;
  deletedAt: string | null;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface RolePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoleCollection {
  data: Role[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

/** Payload for POST /api/v1/roles */
export interface CreateRoleApiDTO {
  name: string;
  description: string;
  badgeColor: string;
  permissions: RolePermission[];
}

/** Payload for PUT /api/v1/roles/:id  (all fields optional = partial update) */
export interface UpdateRoleApiDTO {
  name?: string;
  description?: string;
  badgeColor?: string;
  permissions?: RolePermission[];
}

/** Query params for GET /api/v1/roles */
export interface GetRolesQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

// ── API Response Envelope ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}
