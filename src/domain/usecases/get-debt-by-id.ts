import { DebtModel } from '../models/debt';

export interface GetDebtById {
  getById: (id: string) => Promise<DebtModel>;
}
