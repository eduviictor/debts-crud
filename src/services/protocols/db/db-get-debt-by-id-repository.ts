import { DebtModel } from '@/domain/models/debt';

export interface GetDebtByIdRepository {
  getById: (id: string) => Promise<DebtModel>;
}
