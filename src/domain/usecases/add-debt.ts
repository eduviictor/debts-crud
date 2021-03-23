import { DebtModel } from '../models/debt';

export interface AddDebtModel {
  user_id: number;
  reason: string;
  date: Date;
  amount: string;
}

export interface AddDebt {
  add: (debt: AddDebtModel) => Promise<DebtModel>;
}
