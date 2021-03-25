import { DebtModel } from '@/domain/models/debt';
import { GetDebtsByUser } from '@/domain/usecases/get-debts-by-user';
import { GetDebtsByUserRepository } from '@/services/protocols/db/db-get-debts-by-user-repository';

export class DbGetDebtsByUser implements GetDebtsByUser {
  constructor(
    private readonly getDebtsByIdRepository: GetDebtsByUserRepository
  ) {}

  async getByUser(id: string): Promise<DebtModel[]> {
    return await this.getDebtsByIdRepository.getByUser(id);
  }
}
