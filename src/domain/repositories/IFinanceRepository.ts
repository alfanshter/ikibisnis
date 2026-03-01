/**
 * Repository Interface: IFinanceRepository
 */
import {
  Transaction, CreateTransactionDTO,
  DailyReportResult,
  BalanceSheet,
  IncomeStatement,
  CashFlow
} from '../entities/Finance';

export interface IFinanceRepository {
  // Transactions
  getTransactions(dateFrom?: Date, dateTo?: Date): Promise<Transaction[]>;
  createTransaction(dto: CreateTransactionDTO): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;

  // Reports
  getDailyReport(dateFrom: Date, dateTo: Date, page: number, perPage: number): Promise<DailyReportResult>;
  getBalanceSheet(period: string): Promise<BalanceSheet>;
  getIncomeStatement(period: string): Promise<IncomeStatement>;
  getCashFlow(period: string): Promise<CashFlow>;
}
