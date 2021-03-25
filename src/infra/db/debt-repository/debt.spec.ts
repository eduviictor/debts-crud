import { MongoHelper } from '../helpers/mongo-helper';
import { DebtMongoRepository } from './debt';
import FakeObjectId from 'bson-objectid';

const fakeId = new FakeObjectId();
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

  describe('getById()', () => {
    test('Should return an debt with success', async () => {
      const sut = makeSut();

      const { id } = await sut.add({
        user_id: 1,
        amount: '15.99',
        date,
        reason: 'any_reason',
      });

      const debt = await sut.getById(id);

      expect(debt).toBeTruthy();
      expect(String(debt.id)).toBe(String(id));
      expect(debt.user_id).toBe(1);
      expect(debt.amount).toBe('15.99');
      expect(String(debt.date)).toBe(String(date));
      expect(debt.reason).toBe('any_reason');
    });

    test('Should return null if there is no debt with that id', async () => {
      const sut = makeSut();

      await sut.add({
        user_id: 1,
        amount: '15.99',
        date,
        reason: 'any_reason',
      });

      const debt = await sut.getById(String(fakeId));

      expect(debt).toBeFalsy();
    });
  });

  describe('getByUser()', () => {
    test('Should return a list of debts successfully', async () => {
      const sut = makeSut();

      await sut.add({
        user_id: 1,
        amount: '15.99',
        date,
        reason: 'any_reason',
      });

      const debts = await sut.getByUser(1);

      expect(debts).toBeTruthy();
      expect(Array.isArray(debts)).toBe(true);
      expect(debts[0].id).toBeTruthy();
      expect(debts[0].user_id).toBe(1);
      expect(debts[0].amount).toBe('15.99');
      expect(String(debts[0].date)).toBe(String(date));
      expect(debts[0].reason).toBe('any_reason');
    });

    test('Should return a empty list of debts', async () => {
      const sut = makeSut();

      const debts = await sut.getByUser(2);

      expect(debts).toBeTruthy();
      expect(Array.isArray(debts)).toBe(true);
      expect(debts.length).toBe(0);
    });
  });
});
