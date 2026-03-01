/**
 * Use Case: Delete Project
 */
import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';

export class DeleteProjectUseCase {
  constructor(private repo: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) throw new Error('Project ID wajib diisi.');
    return this.repo.deleteProject(id);
  }
}
