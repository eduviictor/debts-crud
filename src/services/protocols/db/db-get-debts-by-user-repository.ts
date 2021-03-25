import { DebtModel } from '@/domain/models/debt';

export interface GetDebtsByUserRepository {
  getByUser: (id: string) => Promise<DebtModel[]>;
}
