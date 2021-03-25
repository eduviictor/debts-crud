export interface DeleteDebt {
  delete: (id: string) => Promise<void>;
}
