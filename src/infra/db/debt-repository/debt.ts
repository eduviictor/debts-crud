import { DebtModel } from '@/domain/models/debt';
import { AddDebtModel } from '@/domain/usecases/add-debt';
import { AddDebtRepository } from '@/services/protocols/db/db-add-debt-repository';
import { MongoHelper } from '../helpers/mongo-helper';

export class DebtMongoRepository implements AddDebtRepository {
  async add(debtData: AddDebtModel): Promise<DebtModel> {
    const debtCollection = await MongoHelper.getCollection('debts');
    const result = await debtCollection.insertOne(debtData);
    return MongoHelper.map(result.ops[0]);
  }
}
