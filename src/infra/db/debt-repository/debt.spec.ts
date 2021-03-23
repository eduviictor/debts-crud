import { MongoHelper } from '../helpers/mongo-helper';
import { DebtMongoRepository } from './debt';

const date = new Date();

describe('Debt Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const debtColletion = await MongoHelper.getCollection('debts');
    await debtColletion.deleteMany({});
  });

  const makeSut = (): DebtMongoRepository => {
    return new DebtMongoRepository();
  };

  describe('add()', () => {
    test('Should create an debt on success', async () => {
      const sut = makeSut();

      const debt = await sut.add({
        user_id: 1,
        amount: '15.99',
        date,
        reason: 'any_reason',
      });

      expect(debt).toBeTruthy();
      expect(debt.id).toBeTruthy();
      expect(debt.user_id).toBe(1);
      expect(debt.amount).toBe('15.99');
      expect(debt.date).toBe(date);
      expect(debt.reason).toBe('any_reason');
    });
  });
});
