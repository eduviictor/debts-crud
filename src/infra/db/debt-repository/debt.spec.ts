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
    const planetCollection = await MongoHelper.getCollection('debts');
    await planetCollection.deleteMany({});
  });

  const makeSut = (): DebtMongoRepository => {
    return new DebtMongoRepository();
  };

  describe('add()', () => {
    test('Should create an debt on success', async () => {
      const sut = makeSut();

      const planet = await sut.add({
        user_id: 1,
        amount: '15.99',
        date,
        reason: 'any_reason',
      });

      expect(planet).toBeTruthy();
      expect(planet.id).toBeTruthy();
      expect(planet.user_id).toBe(1);
      expect(planet.amount).toBe('15.99');
      expect(planet.date).toBe(date);
      expect(planet.reason).toBe('any_reason');
    });
  });
});
