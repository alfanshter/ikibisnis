import { IDebtRepository } from '@/src/domain/repositories/IDebtRepository';
import { Debt, CreateDebtDTO } from '@/src/domain/entities/Finance';

export class CreateDebt {
  constructor(private repo: IDebtRepository) {}
  execute(dto: CreateDebtDTO): Promise<Debt> {
    return this.repo.create(dto);
  }
}
