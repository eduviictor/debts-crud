import { DebtModel } from '@/domain/models/debt';

export interface GetDebtsByUserRepository {
  getByUser: (id: number) => Promise<DebtModel[]>;
}
