import { DebtModel } from '../models/debt';

export interface GetDebtsByUser {
  getByUser: (id: number) => Promise<DebtModel[]>;
}
