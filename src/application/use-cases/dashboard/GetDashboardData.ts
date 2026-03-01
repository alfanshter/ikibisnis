/**
 * Use Case: Get Dashboard Data
 */
import { Dashboard } from '@/src/domain/entities/Dashboard';
import { IDashboardRepository } from '@/src/domain/repositories/IDashboardRepository';

export class GetDashboardDataUseCase {
  constructor(private repo: IDashboardRepository) {}

  async execute(): Promise<Dashboard> {
    return this.repo.getDashboardData();
  }
}
