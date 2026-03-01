/**
 * Domain Entity: Dashboard Statistics
 * Pure business logic entity without any framework dependencies
 */

export interface DashboardMetric {
  value: number;
  label: string;
  change: number;
  icon: string;
  color: 'blue' | 'red' | 'green' | 'orange';
}

export interface ProjectStatus {
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed' | 'On Hold';
  count: number;
  percentage: number;
}

export interface Activity {
  id: string;
  type: 'payment' | 'user' | 'warning' | 'archive';
  title: string;
  description: string;
  timestamp: Date;
}

export class Dashboard {
  constructor(
    public readonly metrics: DashboardMetric[],
    public readonly projectStatuses: ProjectStatus[],
    public readonly recentActivities: Activity[]
  ) {}

  getTotalProjects(): number {
    return this.projectStatuses.reduce((sum, status) => sum + status.count, 0);
  }

  getMetricByLabel(label: string): DashboardMetric | undefined {
    return this.metrics.find(m => m.label === label);
  }
}
