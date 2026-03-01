/**
 * Use Case: Get Project Statistics
 */
import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';
import { ProjectStats } from '@/src/domain/entities/Project';

export class GetProjectStatsUseCase {
  constructor(private repo: IProjectRepository) {}

  execute(): Promise<ProjectStats> {
    return this.repo.getProjectStats();
  }
}
