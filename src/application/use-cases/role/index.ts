/**
 * Use Cases: Role Management
 * Orchestrates business operations — depends only on IRoleRepository contract.
 */

import {
  Role,
  RoleCollection,
  CreateRoleApiDTO,
  UpdateRoleApiDTO,
  GetRolesQuery,
} from '@/src/domain/entities/Role';
import { IRoleRepository } from '@/src/domain/repositories/IRoleRepository';

// ── Query ─────────────────────────────────────────────────────────────────────

export class GetRolesUseCase {
  constructor(private readonly repo: IRoleRepository) {}

  execute(query: GetRolesQuery = {}): Promise<RoleCollection> {
    return this.repo.getRoles({ page: 1, limit: 10, ...query });
  }
}

export class GetRoleByIdUseCase {
  constructor(private readonly repo: IRoleRepository) {}

  execute(id: string): Promise<Role> {
    return this.repo.getRoleById(id);
  }
}

// ── Command ───────────────────────────────────────────────────────────────────

export class CreateRoleUseCase {
  constructor(private readonly repo: IRoleRepository) {}

  execute(dto: CreateRoleApiDTO): Promise<Role> {
    return this.repo.createRole(dto);
  }
}

export class UpdateRoleUseCase {
  constructor(private readonly repo: IRoleRepository) {}

  execute(id: string, dto: UpdateRoleApiDTO): Promise<Role> {
    return this.repo.updateRole(id, dto);
  }
}

export class ToggleRoleStatusUseCase {
  constructor(private readonly repo: IRoleRepository) {}

  execute(id: string): Promise<Role> {
    return this.repo.toggleStatus(id);
  }
}

export class SoftDeleteRoleUseCase {
  constructor(private readonly repo: IRoleRepository) {}

  execute(id: string): Promise<{ message: string }> {
    return this.repo.softDelete(id);
  }
}

export class RestoreRoleUseCase {
  constructor(private readonly repo: IRoleRepository) {}

  execute(id: string): Promise<Role> {
    return this.repo.restore(id);
  }
}
