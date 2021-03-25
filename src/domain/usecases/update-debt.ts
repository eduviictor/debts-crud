import { DebtModel } from '../models/debt';

export interface UpdateDebtModel {
  user_id: number;
  reason: string;
  date: Date;
  amount: string;
}

export interface UpdateDebt {
  update: (id: string, debt: UpdateDebtModel) => Promise<DebtModel>;
}
