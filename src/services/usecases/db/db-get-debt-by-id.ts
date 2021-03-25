import { DebtModel } from '@/domain/models/debt';
import { GetDebtById } from '@/domain/usecases/get-debt-by-id';
import { GetDebtByIdRepository } from '@/services/protocols/db/db-get-debt-by-id-repository';

export class DbGetDebtById implements GetDebtById {
  constructor(private readonly getDebtByIdRepository: GetDebtByIdRepository) {}

  async getById(id: string): Promise<DebtModel> {
    return await this.getDebtByIdRepository.getById(id);
  }
}
