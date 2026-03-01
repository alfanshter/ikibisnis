/**
 * Use Case: Create Project
 */
import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';
import { Project, CreateProjectDTO } from '@/src/domain/entities/Project';

export class CreateProjectUseCase {
  constructor(private repo: IProjectRepository) {}

  async execute(dto: CreateProjectDTO): Promise<Project> {
    if (!dto.title.trim())       throw new Error('Judul project wajib diisi.');
    if (!dto.client.name.trim()) throw new Error('Nama klien wajib diisi.');
    if (dto.items.length === 0)  throw new Error('Minimal satu item pengadaan harus ditambahkan.');
    return this.repo.createProject(dto);
  }
}
