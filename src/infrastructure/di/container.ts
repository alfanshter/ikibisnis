/**
 * Dependency Injection Container
 * Centralized place for managing dependencies
 */

import { DashboardRepository } from '@/src/infrastructure/repositories/DashboardRepository';
import { UserRepository }      from '@/src/infrastructure/repositories/UserRepository';
import { ProjectRepository }   from '@/src/infrastructure/repositories/ProjectRepository';
import { FinanceRepository }   from '@/src/infrastructure/repositories/FinanceRepository';
import { SettingsRepository }  from '@/src/infrastructure/repositories/SettingsRepository';

import { GetDashboardDataUseCase } from '@/src/application/use-cases/dashboard';
import {
  GetUsersUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  GetRolePermissionsUseCase,
  UpdateRolePermissionsUseCase,
} from '@/src/application/use-cases/user';
import {
  GetProjectsUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectStatsUseCase,
} from '@/src/application/use-cases/project';
import {
  GetDailyReportUseCase,
  GetBalanceSheetUseCase,
  GetIncomeStatementUseCase,
  GetCashFlowUseCase,
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
} from '@/src/application/use-cases/finance';
import {
  GetSettingsUseCase,
  UpdateStoreUseCase,
  UpdateProfileUseCase,
  UpdateAppearanceUseCase,
  ChangePasswordUseCase,
} from '@/src/application/use-cases/settings';

class DIContainer {
  private static instance: DIContainer;
  private dashboardRepository: DashboardRepository;
  private userRepository: UserRepository;
  private projectRepository: ProjectRepository;
  private financeRepository: FinanceRepository;
  private settingsRepository: SettingsRepository;

  private getDashboardDataUseCase: GetDashboardDataUseCase;
  private getUsersUseCase: GetUsersUseCase;
  private createUserUseCase: CreateUserUseCase;
  private updateUserUseCase: UpdateUserUseCase;
  private deleteUserUseCase: DeleteUserUseCase;
  private getRolePermissionsUseCase: GetRolePermissionsUseCase;
  private updateRolePermissionsUseCase: UpdateRolePermissionsUseCase;
  private getProjectsUseCase: GetProjectsUseCase;
  private createProjectUseCase: CreateProjectUseCase;
  private updateProjectUseCase: UpdateProjectUseCase;
  private deleteProjectUseCase: DeleteProjectUseCase;
  private getProjectStatsUseCase: GetProjectStatsUseCase;
  private getDailyReportUseCase: GetDailyReportUseCase;
  private getBalanceSheetUseCase: GetBalanceSheetUseCase;
  private getIncomeStatementUseCase: GetIncomeStatementUseCase;
  private getCashFlowUseCase: GetCashFlowUseCase;
  private createTransactionUseCase: CreateTransactionUseCase;
  private deleteTransactionUseCase: DeleteTransactionUseCase;
  private getSettingsUseCase: GetSettingsUseCase;
  private updateStoreUseCase: UpdateStoreUseCase;
  private updateProfileUseCase: UpdateProfileUseCase;
  private updateAppearanceUseCase: UpdateAppearanceUseCase;
  private changePasswordUseCase: ChangePasswordUseCase;

  private constructor() {
    this.dashboardRepository = new DashboardRepository();
    this.userRepository = new UserRepository();
    this.projectRepository = new ProjectRepository();
    this.financeRepository = new FinanceRepository();
    this.settingsRepository = new SettingsRepository();

    this.getDashboardDataUseCase = new GetDashboardDataUseCase(this.dashboardRepository);
    this.getUsersUseCase = new GetUsersUseCase(this.userRepository);
    this.createUserUseCase = new CreateUserUseCase(this.userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(this.userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(this.userRepository);
    this.getRolePermissionsUseCase = new GetRolePermissionsUseCase(this.userRepository);
    this.updateRolePermissionsUseCase = new UpdateRolePermissionsUseCase(this.userRepository);
    this.getProjectsUseCase = new GetProjectsUseCase(this.projectRepository);
    this.createProjectUseCase = new CreateProjectUseCase(this.projectRepository);
    this.updateProjectUseCase = new UpdateProjectUseCase(this.projectRepository);
    this.deleteProjectUseCase = new DeleteProjectUseCase(this.projectRepository);
    this.getProjectStatsUseCase = new GetProjectStatsUseCase(this.projectRepository);
    this.getDailyReportUseCase = new GetDailyReportUseCase(this.financeRepository);
    this.getBalanceSheetUseCase = new GetBalanceSheetUseCase(this.financeRepository);
    this.getIncomeStatementUseCase = new GetIncomeStatementUseCase(this.financeRepository);
    this.getCashFlowUseCase = new GetCashFlowUseCase(this.financeRepository);
    this.createTransactionUseCase = new CreateTransactionUseCase(this.financeRepository);
    this.deleteTransactionUseCase = new DeleteTransactionUseCase(this.financeRepository);
    this.getSettingsUseCase       = new GetSettingsUseCase(this.settingsRepository);
    this.updateStoreUseCase       = new UpdateStoreUseCase(this.settingsRepository);
    this.updateProfileUseCase     = new UpdateProfileUseCase(this.settingsRepository);
    this.updateAppearanceUseCase  = new UpdateAppearanceUseCase(this.settingsRepository);
    this.changePasswordUseCase    = new ChangePasswordUseCase(this.settingsRepository);
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  getGetDashboardDataUseCase(): GetDashboardDataUseCase {
    return this.getDashboardDataUseCase;
  }
  getGetUsersUseCase(): GetUsersUseCase {
    return this.getUsersUseCase;
  }
  getCreateUserUseCase(): CreateUserUseCase {
    return this.createUserUseCase;
  }
  getUpdateUserUseCase(): UpdateUserUseCase {
    return this.updateUserUseCase;
  }
  getDeleteUserUseCase(): DeleteUserUseCase {
    return this.deleteUserUseCase;
  }
  getGetRolePermissionsUseCase(): GetRolePermissionsUseCase {
    return this.getRolePermissionsUseCase;
  }
  getUpdateRolePermissionsUseCase(): UpdateRolePermissionsUseCase {
    return this.updateRolePermissionsUseCase;
  }
  getGetProjectsUseCase(): GetProjectsUseCase {
    return this.getProjectsUseCase;
  }
  getCreateProjectUseCase(): CreateProjectUseCase {
    return this.createProjectUseCase;
  }
  getUpdateProjectUseCase(): UpdateProjectUseCase {
    return this.updateProjectUseCase;
  }
  getDeleteProjectUseCase(): DeleteProjectUseCase {
    return this.deleteProjectUseCase;
  }
  getGetProjectStatsUseCase(): GetProjectStatsUseCase {
    return this.getProjectStatsUseCase;
  }
  getGetDailyReportUseCase(): GetDailyReportUseCase {
    return this.getDailyReportUseCase;
  }
  getGetBalanceSheetUseCase(): GetBalanceSheetUseCase {
    return this.getBalanceSheetUseCase;
  }
  getGetIncomeStatementUseCase(): GetIncomeStatementUseCase {
    return this.getIncomeStatementUseCase;
  }
  getGetCashFlowUseCase(): GetCashFlowUseCase {
    return this.getCashFlowUseCase;
  }
  getCreateTransactionUseCase(): CreateTransactionUseCase {
    return this.createTransactionUseCase;
  }
  getDeleteTransactionUseCase(): DeleteTransactionUseCase {
    return this.deleteTransactionUseCase;
  }
  getGetSettingsUseCase(): GetSettingsUseCase {
    return this.getSettingsUseCase;
  }
  getUpdateStoreUseCase(): UpdateStoreUseCase {
    return this.updateStoreUseCase;
  }
  getUpdateProfileUseCase(): UpdateProfileUseCase {
    return this.updateProfileUseCase;
  }
  getUpdateAppearanceUseCase(): UpdateAppearanceUseCase {
    return this.updateAppearanceUseCase;
  }
  getChangePasswordUseCase(): ChangePasswordUseCase {
    return this.changePasswordUseCase;
  }
}

export default DIContainer;
