import { DebtModel } from '@/domain/models/debt';
import { AddDebtModel } from '@/domain/usecases/add-debt';
import { AddDebtRepository } from '@/services/protocols/db/db-add-debt-repository';
import { DeleteDebtRepository } from '@/services/protocols/db/db-delete-debt-repository';
import { GetDebtByIdRepository } from '@/services/protocols/db/db-get-debt-by-id-repository';
import { GetDebtsByUserRepository } from '@/services/protocols/db/db-get-debts-by-user-repository';
import { ObjectId } from 'bson';
import { MongoHelper } from '../helpers/mongo-helper';

export class DebtMongoRepository
  implements
    AddDebtRepository,
    GetDebtByIdRepository,
    GetDebtsByUserRepository,
    DeleteDebtRepository {
  async add(debtData: AddDebtModel): Promise<DebtModel> {
    const debtCollection = await MongoHelper.getCollection('debts');
    const result = await debtCollection.insertOne(debtData);
    return MongoHelper.map(result.ops[0]);
  }

  async getById(id: string): Promise<DebtModel> {
    const debtCollection = await MongoHelper.getCollection('debts');
    const result = await debtCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return null;
    }
    return MongoHelper.map(result);
  }

  async getByUser(id: number): Promise<DebtModel[]> {
    const debtCollection = await MongoHelper.getCollection('debts');
    const result = await debtCollection
      .find({
        user_id: Number(id),
      })
      .toArray();

    return MongoHelper.mapCollection(result);
  }

  async delete(id: string): Promise<void> {
    const debtCollection = await MongoHelper.getCollection('debts');
    await debtCollection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}
