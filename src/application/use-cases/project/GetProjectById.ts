import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';
import { Project } from '@/src/domain/entities/Project';

export class GetProjectByIdUseCase {
  constructor(private repo: IProjectRepository) {}

  async execute(id: string): Promise<Project | null> {
    return this.repo.getProjectById(id);
  }
}
