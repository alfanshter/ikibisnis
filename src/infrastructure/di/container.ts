/**
 * Dependency Injection Container
 * Centralized place for managing dependencies
 */

import { DashboardRepository } from '@/src/infrastructure/repositories/DashboardRepository';
import { UserRepository }      from '@/src/infrastructure/repositories/UserRepository';
import { ProjectRepository }   from '@/src/infrastructure/repositories/ProjectRepository';
import { QuotationRepository } from '@/src/infrastructure/repositories/QuotationRepository';
import { FinanceRepository }   from '@/src/infrastructure/repositories/FinanceRepository';
import { DebtRepository }      from '@/src/infrastructure/repositories/DebtRepository';
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
import {  GetProjectsUseCase,
  GetProjectByIdUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectStatsUseCase,
  PayTerminUseCase,
} from '@/src/application/use-cases/project';
import {
  GetQuotationsUseCase,
  GetQuotationByIdUseCase,
  GetQuotationStatsUseCase,
  CreateQuotationUseCase,
  UpdateQuotationUseCase,
  SendQuotationUseCase,
  AccQuotationUseCase,
  RejectQuotationUseCase,
  ConvertToProjectUseCase,
  DeleteQuotationUseCase,
} from '@/src/application/use-cases/quotation';
import {
  GetDailyReportUseCase,
  GetBalanceSheetUseCase,
  GetIncomeStatementUseCase,
  GetCashFlowUseCase,
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
} from '@/src/application/use-cases/finance';
import { GetDebts }        from '@/src/application/use-cases/finance/GetDebts';
import { GetDebtSummary }  from '@/src/application/use-cases/finance/GetDebtSummary';
import { CreateDebt }      from '@/src/application/use-cases/finance/CreateDebt';
import { UpdateDebt }      from '@/src/application/use-cases/finance/UpdateDebt';
import { PayDebt }         from '@/src/application/use-cases/finance/PayDebt';
import { DeleteDebt }      from '@/src/application/use-cases/finance/DeleteDebt';
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
  private quotationRepository: QuotationRepository;
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
  private getProjectByIdUseCase: GetProjectByIdUseCase;
  private createProjectUseCase: CreateProjectUseCase;
  private updateProjectUseCase: UpdateProjectUseCase;
  private deleteProjectUseCase: DeleteProjectUseCase;
  private getProjectStatsUseCase: GetProjectStatsUseCase;
  private payTerminUseCase: PayTerminUseCase;
  // Quotation use-cases
  private getQuotationsUseCase: GetQuotationsUseCase;
  private getQuotationByIdUseCase: GetQuotationByIdUseCase;
  private getQuotationStatsUseCase: GetQuotationStatsUseCase;
  private createQuotationUseCase: CreateQuotationUseCase;
  private updateQuotationUseCase: UpdateQuotationUseCase;
  private sendQuotationUseCase: SendQuotationUseCase;
  private accQuotationUseCase: AccQuotationUseCase;
  private rejectQuotationUseCase: RejectQuotationUseCase;
  private convertToProjectUseCase: ConvertToProjectUseCase;
  private deleteQuotationUseCase: DeleteQuotationUseCase;
  //
  private getDailyReportUseCase: GetDailyReportUseCase;
  private getBalanceSheetUseCase: GetBalanceSheetUseCase;
  private getIncomeStatementUseCase: GetIncomeStatementUseCase;
  private getCashFlowUseCase: GetCashFlowUseCase;
  private createTransactionUseCase: CreateTransactionUseCase;
  private deleteTransactionUseCase: DeleteTransactionUseCase;
  // Debt
  private debtRepository: DebtRepository;
  private getDebtsUseCase: GetDebts;
  private getDebtSummaryUseCase: GetDebtSummary;
  private createDebtUseCase: CreateDebt;
  private updateDebtUseCase: UpdateDebt;
  private payDebtUseCase: PayDebt;
  private deleteDebtUseCase: DeleteDebt;
  //
  private getSettingsUseCase: GetSettingsUseCase;
  private updateStoreUseCase: UpdateStoreUseCase;
  private updateProfileUseCase: UpdateProfileUseCase;
  private updateAppearanceUseCase: UpdateAppearanceUseCase;
  private changePasswordUseCase: ChangePasswordUseCase;

  private constructor() {
    this.dashboardRepository = new DashboardRepository();
    this.userRepository = new UserRepository();
    this.projectRepository = new ProjectRepository();
    this.quotationRepository = new QuotationRepository();
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
    this.getProjectByIdUseCase = new GetProjectByIdUseCase(this.projectRepository);
    this.createProjectUseCase = new CreateProjectUseCase(this.projectRepository);
    this.updateProjectUseCase = new UpdateProjectUseCase(this.projectRepository);
    this.deleteProjectUseCase = new DeleteProjectUseCase(this.projectRepository);
    this.getProjectStatsUseCase = new GetProjectStatsUseCase(this.projectRepository);
    this.payTerminUseCase = new PayTerminUseCase(this.projectRepository);
    // Quotation
    this.getQuotationsUseCase     = new GetQuotationsUseCase(this.quotationRepository);
    this.getQuotationByIdUseCase  = new GetQuotationByIdUseCase(this.quotationRepository);
    this.getQuotationStatsUseCase = new GetQuotationStatsUseCase(this.quotationRepository);
    this.createQuotationUseCase   = new CreateQuotationUseCase(this.quotationRepository);
    this.updateQuotationUseCase   = new UpdateQuotationUseCase(this.quotationRepository);
    this.sendQuotationUseCase     = new SendQuotationUseCase(this.quotationRepository);
    this.accQuotationUseCase      = new AccQuotationUseCase(this.quotationRepository);
    this.rejectQuotationUseCase   = new RejectQuotationUseCase(this.quotationRepository);
    this.convertToProjectUseCase  = new ConvertToProjectUseCase(this.quotationRepository);
    this.deleteQuotationUseCase   = new DeleteQuotationUseCase(this.quotationRepository);
    this.getDailyReportUseCase = new GetDailyReportUseCase(this.financeRepository);
    this.getBalanceSheetUseCase = new GetBalanceSheetUseCase(this.financeRepository);
    this.getIncomeStatementUseCase = new GetIncomeStatementUseCase(this.financeRepository);
    this.getCashFlowUseCase = new GetCashFlowUseCase(this.financeRepository);
    this.createTransactionUseCase = new CreateTransactionUseCase(this.financeRepository);
    this.deleteTransactionUseCase = new DeleteTransactionUseCase(this.financeRepository);
    // Debt
    this.debtRepository       = new DebtRepository();
    this.getDebtsUseCase      = new GetDebts(this.debtRepository);
    this.getDebtSummaryUseCase = new GetDebtSummary(this.debtRepository);
    this.createDebtUseCase    = new CreateDebt(this.debtRepository);
    this.updateDebtUseCase    = new UpdateDebt(this.debtRepository);
    this.payDebtUseCase       = new PayDebt(this.debtRepository);
    this.deleteDebtUseCase    = new DeleteDebt(this.debtRepository);
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
  // ─────────────────────────────────────────────────────────────────────────
  getGetProjectsUseCase(): GetProjectsUseCase {
    return this.getProjectsUseCase;
  }
  getGetProjectByIdUseCase(): GetProjectByIdUseCase {
    return this.getProjectByIdUseCase;
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
  getPayTerminUseCase(): PayTerminUseCase {
    return this.payTerminUseCase;
  }
  // ── Quotation ────────────────────────────────────────────────────────────
  getGetQuotationsUseCase(): GetQuotationsUseCase {
    return this.getQuotationsUseCase;
  }
  getGetQuotationByIdUseCase(): GetQuotationByIdUseCase {
    return this.getQuotationByIdUseCase;
  }
  getGetQuotationStatsUseCase(): GetQuotationStatsUseCase {
    return this.getQuotationStatsUseCase;
  }
  getCreateQuotationUseCase(): CreateQuotationUseCase {
    return this.createQuotationUseCase;
  }
  getUpdateQuotationUseCase(): UpdateQuotationUseCase {
    return this.updateQuotationUseCase;
  }
  getSendQuotationUseCase(): SendQuotationUseCase {
    return this.sendQuotationUseCase;
  }
  getAccQuotationUseCase(): AccQuotationUseCase {
    return this.accQuotationUseCase;
  }
  getRejectQuotationUseCase(): RejectQuotationUseCase {
    return this.rejectQuotationUseCase;
  }
  getConvertToProjectUseCase(): ConvertToProjectUseCase {
    return this.convertToProjectUseCase;
  }
  getDeleteQuotationUseCase(): DeleteQuotationUseCase {
    return this.deleteQuotationUseCase;
  }
  // ─────────────────────────────────────────────────────────────────────────
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
  // ── Debt ─────────────────────────────────────────────────────────────────
  getGetDebtsUseCase(): GetDebts { return this.getDebtsUseCase; }
  getGetDebtSummaryUseCase(): GetDebtSummary { return this.getDebtSummaryUseCase; }
  getCreateDebtUseCase(): CreateDebt { return this.createDebtUseCase; }
  getUpdateDebtUseCase(): UpdateDebt { return this.updateDebtUseCase; }
  getPayDebtUseCase(): PayDebt { return this.payDebtUseCase; }
  getDeleteDebtUseCase(): DeleteDebt { return this.deleteDebtUseCase; }
  // ─────────────────────────────────────────────────────────────────────────
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
