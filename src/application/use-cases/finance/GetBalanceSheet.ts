/**
 * Use Case: Get Balance Sheet (Neraca)
 */
import { IFinanceRepository } from '@/src/domain/repositories/IFinanceRepository';
import { BalanceSheet } from '@/src/domain/entities/Finance';

export class GetBalanceSheetUseCase {
  constructor(private repo: IFinanceRepository) {}

  execute(period: string): Promise<BalanceSheet> {
    return this.repo.getBalanceSheet(period);
  }
}
