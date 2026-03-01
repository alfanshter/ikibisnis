/**
 * Repository Interface: IProjectRepository
 * Contract for all project data operations.
 */

import {
  Project,
  ProjectCollection,
  ProjectStats,
  CreateProjectDTO,
  UpdateProjectDTO
} from '../entities/Project';

export interface IProjectRepository {
  /** Paginated list (optionally filtered by status / category) */
  getProjects(
    page: number,
    perPage: number,
    statusFilter?: string,
    categoryFilter?: string,
    search?: string
  ): Promise<ProjectCollection>;

  getProjectById(id: string): Promise<Project | null>;
  getProjectStats(): Promise<ProjectStats>;

  createProject(dto: CreateProjectDTO): Promise<Project>;
  updateProject(dto: UpdateProjectDTO): Promise<Project>;
  deleteProject(id: string): Promise<void>;
}
