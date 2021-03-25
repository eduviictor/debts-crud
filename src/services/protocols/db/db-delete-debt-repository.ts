export interface DeleteDebtRepository {
  delete: (id: string) => Promise<void>;
}
