import { DebtModel } from '../models/debt';

export interface GetDebtsByUser {
  getByUser: (id: string) => Promise<DebtModel[]>;
}
