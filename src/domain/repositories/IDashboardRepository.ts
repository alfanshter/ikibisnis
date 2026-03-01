/**
 * Domain Repository Interface
 * Defines contract for data access without implementation details
 */

import { Dashboard } from '../entities/Dashboard';

export interface IDashboardRepository {
  getDashboardData(): Promise<Dashboard>;
  refreshMetrics(): Promise<void>;
}
