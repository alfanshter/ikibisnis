/**
 * Use Case: Get Daily Report
 */
import { IFinanceRepository } from '@/src/domain/repositories/IFinanceRepository';
import { DailyReportResult } from '@/src/domain/entities/Finance';

export class GetDailyReportUseCase {
  constructor(private repo: IFinanceRepository) {}

  execute(dateFrom: Date, dateTo: Date, page = 1, perPage = 7): Promise<DailyReportResult> {
    return this.repo.getDailyReport(dateFrom, dateTo, page, perPage);
  }
}
