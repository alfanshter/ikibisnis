/**
 * Use Case: Get Projects (paginated + filtered)
 */
import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';
import { ProjectCollection } from '@/src/domain/entities/Project';

export class GetProjectsUseCase {
  constructor(private repo: IProjectRepository) {}

  execute(
    page = 1,
    perPage = 6,
    statusFilter?: string,
    categoryFilter?: string,
    search?: string,
  ): Promise<ProjectCollection> {
    return this.repo.getProjects(page, perPage, statusFilter, categoryFilter, search);
  }
}
