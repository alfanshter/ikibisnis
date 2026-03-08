import {
  Debt,
  DebtCollection,
  DebtSummary,
  CreateDebtDTO,
  UpdateDebtDTO,
  PayDebtDTO,
  GetDebtsQuery,
} from '../entities/Finance';

export interface IDebtRepository {
  getAll(query: GetDebtsQuery): Promise<DebtCollection>;
  getById(id: string): Promise<Debt>;
  getSummary(): Promise<DebtSummary>;
  create(dto: CreateDebtDTO): Promise<Debt>;
  update(id: string, dto: UpdateDebtDTO): Promise<Debt>;
  pay(id: string, dto: PayDebtDTO): Promise<Debt>;
  delete(id: string): Promise<void>;
}
