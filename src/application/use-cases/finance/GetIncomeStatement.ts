/**
 * Use Case: Get Income Statement (Laba Rugi)
 */
import { IFinanceRepository } from '@/src/domain/repositories/IFinanceRepository';
import { IncomeStatement } from '@/src/domain/entities/Finance';

export class GetIncomeStatementUseCase {
  constructor(private repo: IFinanceRepository) {}

  execute(period: string): Promise<IncomeStatement> {
    return this.repo.getIncomeStatement(period);
  }
}
