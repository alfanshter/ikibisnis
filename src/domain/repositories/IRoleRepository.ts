/**
 * Domain Repository Interface: Role Management
 * Contract for all role data operations — no implementation details.
 */

import {
  Role,
  RoleCollection,
  CreateRoleApiDTO,
  UpdateRoleApiDTO,
  GetRolesQuery,
} from '../entities/Role';

export interface IRoleRepository {
  /** GET /api/v1/roles */
  getRoles(query: GetRolesQuery): Promise<RoleCollection>;

  /** GET /api/v1/roles/:id */
  getRoleById(id: string): Promise<Role>;

  /** POST /api/v1/roles */
  createRole(dto: CreateRoleApiDTO): Promise<Role>;

  /** PUT /api/v1/roles/:id */
  updateRole(id: string, dto: UpdateRoleApiDTO): Promise<Role>;

  /** PATCH /api/v1/roles/:id/toggle-status */
  toggleStatus(id: string): Promise<Role>;

  /** DELETE /api/v1/roles/:id */
  softDelete(id: string): Promise<{ message: string }>;

  /** PATCH /api/v1/roles/:id/restore */
  restore(id: string): Promise<Role>;
}
