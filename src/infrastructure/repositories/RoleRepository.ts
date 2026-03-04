/**
 * Infrastructure: Role Repository Implementation
 * In-memory store with full CRUD.  Swap internals for a real DB adapter
 * without touching any other layer.
 */

import { randomUUID } from 'crypto';
import {
  Role,
  RoleCollection,
  CreateRoleApiDTO,
  UpdateRoleApiDTO,
  GetRolesQuery,
  SYSTEM_FEATURES,
} from '@/src/domain/entities/Role';
import { IRoleRepository } from '@/src/domain/repositories/IRoleRepository';

// ── Custom errors ─────────────────────────────────────────────────────────────

export class RoleNotFoundError extends Error {
  readonly statusCode = 404;
  constructor(id: string) { super(`Role with id "${id}" not found.`); }
}

export class RoleDuplicateNameError extends Error {
  readonly statusCode = 409;
  constructor(name: string) { super(`A role with the name "${name}" already exists.`); }
}

export class RoleValidationError extends Error {
  readonly statusCode = 422;
  constructor(message: string) { super(message); }
}

export class RoleFeatureInvalidError extends Error {
  readonly statusCode = 400;
  constructor(feature: string) { super(`Feature "${feature}" is not a valid SystemFeature.`); }
}

// ── In-memory store (starts empty) ───────────────────────────────────────────

const now = () => new Date().toISOString();

let STORE: Role[] = [];

// ── Helpers ───────────────────────────────────────────────────────────────────

function validateFeatures(dto: CreateRoleApiDTO | UpdateRoleApiDTO): void {
  const perms = (dto as CreateRoleApiDTO).permissions ?? (dto as UpdateRoleApiDTO).permissions;
  if (!perms) return;
  for (const p of perms) {
    if (!(SYSTEM_FEATURES as readonly string[]).includes(p.feature)) {
      throw new RoleFeatureInvalidError(p.feature);
    }
  }
}

// ── Repository ────────────────────────────────────────────────────────────────

export class RoleRepository implements IRoleRepository {
  // ── GET all (pagination + search + filter) ──────────────────────────────
  async getRoles(query: GetRolesQuery): Promise<RoleCollection> {
    const page     = Math.max(1, query.page  ?? 1);
    const limit    = Math.min(100, Math.max(1, query.limit ?? 10));
    const search   = query.search?.toLowerCase().trim();
    const isActive = query.isActive;

    let filtered = STORE.filter(r => r.deletedAt === null);

    if (isActive !== undefined) {
      filtered = filtered.filter(r => r.isActive === isActive);
    }

    if (search) {
      filtered = filtered.filter(
        r => r.name.toLowerCase().includes(search) ||
             r.description.toLowerCase().includes(search)
      );
    }

    const total      = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const data       = filtered.slice((page - 1) * limit, page * limit);

    return { data, page, limit, total, totalPages };
  }

  // ── GET one ──────────────────────────────────────────────────────────────
  async getRoleById(id: string): Promise<Role> {
    const role = STORE.find(r => r.id === id && r.deletedAt === null);
    if (!role) throw new RoleNotFoundError(id);
    return { ...role };
  }

  // ── CREATE ───────────────────────────────────────────────────────────────
  async createRole(dto: CreateRoleApiDTO): Promise<Role> {
    // Validation
    if (!dto.name?.trim())        throw new RoleValidationError('name is required');
    if (!dto.description?.trim()) throw new RoleValidationError('description is required');
    if (!dto.badgeColor?.trim())  throw new RoleValidationError('badgeColor is required');
    if (!dto.permissions?.length) throw new RoleValidationError('permissions must not be empty');
    validateFeatures(dto);

    // Duplicate name check (case-insensitive)
    const exists = STORE.some(
      r => r.name.toLowerCase() === dto.name.toLowerCase() && r.deletedAt === null
    );
    if (exists) throw new RoleDuplicateNameError(dto.name);

    const ts  = now();
    const role: Role = {
      id:          randomUUID(),
      name:        dto.name.trim(),
      description: dto.description.trim(),
      badgeColor:  dto.badgeColor.trim(),
      isActive:    true,
      permissions: dto.permissions,
      createdAt:   ts,
      updatedAt:   ts,
      deletedAt:   null,
    };
    STORE = [role, ...STORE];
    return { ...role };
  }

  // ── UPDATE (partial) ──────────────────────────────────────────────────────
  async updateRole(id: string, dto: UpdateRoleApiDTO): Promise<Role> {
    const idx = STORE.findIndex(r => r.id === id && r.deletedAt === null);
    if (idx === -1) throw new RoleNotFoundError(id);

    // Duplicate name check when name changes
    if (dto.name) {
      const duplicate = STORE.some(
        r => r.id !== id && r.name.toLowerCase() === dto.name!.toLowerCase() && r.deletedAt === null
      );
      if (duplicate) throw new RoleDuplicateNameError(dto.name);
    }

    if (dto.permissions) validateFeatures(dto);

    const updated: Role = {
      ...STORE[idx],
      ...(dto.name        !== undefined && { name:        dto.name.trim()        }),
      ...(dto.description !== undefined && { description: dto.description.trim() }),
      ...(dto.badgeColor  !== undefined && { badgeColor:  dto.badgeColor.trim()  }),
      ...(dto.permissions !== undefined && { permissions: dto.permissions        }),
      updatedAt: now(),
    };
    STORE = [...STORE.slice(0, idx), updated, ...STORE.slice(idx + 1)];
    return { ...updated };
  }

  // ── TOGGLE STATUS ─────────────────────────────────────────────────────────
  async toggleStatus(id: string): Promise<Role> {
    const idx = STORE.findIndex(r => r.id === id && r.deletedAt === null);
    if (idx === -1) throw new RoleNotFoundError(id);

    const updated: Role = {
      ...STORE[idx],
      isActive:  !STORE[idx].isActive,
      updatedAt: now(),
    };
    STORE = [...STORE.slice(0, idx), updated, ...STORE.slice(idx + 1)];
    return { ...updated };
  }

  // ── SOFT DELETE ───────────────────────────────────────────────────────────
  async softDelete(id: string): Promise<{ message: string }> {
    const idx = STORE.findIndex(r => r.id === id && r.deletedAt === null);
    if (idx === -1) throw new RoleNotFoundError(id);

    const deleted: Role = { ...STORE[idx], deletedAt: now(), updatedAt: now() };
    STORE = [...STORE.slice(0, idx), deleted, ...STORE.slice(idx + 1)];
    return { message: `Role "${deleted.name}" has been deleted.` };
  }

  // ── RESTORE ───────────────────────────────────────────────────────────────
  async restore(id: string): Promise<Role> {
    const idx = STORE.findIndex(r => r.id === id && r.deletedAt !== null);
    if (idx === -1) throw new RoleNotFoundError(id);

    const restored: Role = { ...STORE[idx], deletedAt: null, updatedAt: now() };
    STORE = [...STORE.slice(0, idx), restored, ...STORE.slice(idx + 1)];
    return { ...restored };
  }
}
