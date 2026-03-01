/**
 * Infrastructure: Dashboard Repository Implementation
 * Handles data fetching from API or mock data
 */

import { Dashboard, DashboardMetric, ProjectStatus, Activity } from '@/src/domain/entities/Dashboard';
import { IDashboardRepository } from '@/src/domain/repositories/IDashboardRepository';

export class DashboardRepository implements IDashboardRepository {
  async getDashboardData(): Promise<Dashboard> {
    // Simulate API call - replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 500));

    const metrics: DashboardMetric[] = [
      {
        value: 12543,
        label: 'Total Users',
        change: 12.5,
        icon: 'users',
        color: 'blue'
      },
      {
        value: 84,
        label: 'Active Projects',
        change: -2.4,
        icon: 'rocket',
        color: 'blue'
      },
      {
        value: 128430,
        label: 'Total Revenue',
        change: 18.2,
        icon: 'dollar',
        color: 'green'
      },
      {
        value: 42120,
        label: 'Total Expenses',
        change: 5.1,
        icon: 'cart',
        color: 'orange'
      }
    ];

    const projectStatuses: ProjectStatus[] = [
      { status: 'To Do', count: 12, percentage: 15 },
      { status: 'In Progress', count: 28, percentage: 35 },
      { status: 'Review', count: 18, percentage: 22 },
      { status: 'Completed', count: 20, percentage: 25 },
      { status: 'On Hold', count: 6, percentage: 8 }
    ];

    const recentActivities: Activity[] = [
      {
        id: '1',
        type: 'payment',
        title: 'Payment received',
        description: 'Project "SaaS Landing" - $2,400',
        timestamp: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        id: '2',
        type: 'user',
        title: 'New user registered',
        description: 'Sarah J. joined the team',
        timestamp: new Date(Date.now() - 16 * 60 * 1000)
      },
      {
        id: '3',
        type: 'warning',
        title: 'Deadline approaching',
        description: 'Mobile App v2 due tomorrow',
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: '4',
        type: 'archive',
        title: 'Project archived',
        description: 'Old branding guide 2023',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ];

    return new Dashboard(metrics, projectStatuses, recentActivities);
  }

  async refreshMetrics(): Promise<void> {
    // Implement refresh logic
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}
