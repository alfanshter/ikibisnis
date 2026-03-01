/**
 * Use Case: Update Project
 */
import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';
import { Project, UpdateProjectDTO } from '@/src/domain/entities/Project';

export class UpdateProjectUseCase {
  constructor(private repo: IProjectRepository) {}

  async execute(dto: UpdateProjectDTO): Promise<Project> {
    if (!dto.id) throw new Error('Project ID wajib diisi.');
    return this.repo.updateProject(dto);
  }
}
