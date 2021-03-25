import { DebtModel } from '@/domain/models/debt';
import { AddDebtModel } from '@/domain/usecases/add-debt';
import { AddDebtRepository } from '@/services/protocols/db/db-add-debt-repository';
import { GetDebtByIdRepository } from '@/services/protocols/db/db-get-debt-by-id-repository';
import { ObjectId } from 'bson';
import { MongoHelper } from '../helpers/mongo-helper';

export class DebtMongoRepository
  implements AddDebtRepository, GetDebtByIdRepository {
  async add(debtData: AddDebtModel): Promise<DebtModel> {
    const debtCollection = await MongoHelper.getCollection('debts');
    const result = await debtCollection.insertOne(debtData);
    return MongoHelper.map(result.ops[0]);
  }

  async getById(id: string): Promise<DebtModel> {
    const planetCollection = await MongoHelper.getCollection('debts');
    const result = await planetCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!result) {
      return null;
    }
    return MongoHelper.map(result);
  }
}
