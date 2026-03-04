/**
 * Server-side singleton for RoleRepository.
 * Storing it on `globalThis` keeps the in-memory store alive across
 * Next.js hot-module reloads in development.
 */

import { RoleRepository } from '@/src/infrastructure/repositories/RoleRepository';

const g = globalThis as typeof globalThis & { _roleRepo?: RoleRepository };
if (!g._roleRepo) g._roleRepo = new RoleRepository();

export const roleRepo = g._roleRepo;
