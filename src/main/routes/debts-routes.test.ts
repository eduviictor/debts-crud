import { MongoHelper } from '@/infra/db/helpers/mongo-helper';
import { ObjectID, ObjectId } from 'bson';
import request from 'supertest';
import app from '../config/app';

const date = new Date().toLocaleDateString('en-CA', {
  day: '2-digit',
  year: 'numeric',
  month: '2-digit',
});

describe('Debt Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const debtCollection = await MongoHelper.getCollection('debts');
    await debtCollection.deleteMany({});
  });

  test('Should create an debt on success', async () => {
    await request(app)
      .post('/debts')
      .send({
        user_id: 1,
        reason: 'any_reason',
        date,
        amount: '15.99',
      })
      .expect(200);
  });

  test('Should return a debt based on its id', async () => {
    const debtCollection = await MongoHelper.getCollection('debts');
    const debtInDb = await debtCollection.insertOne({
      user_id: 1,
      reason: 'any_reason',
      date: String(date),
      amount: '15.99',
    });

    const id = debtInDb.ops[0]._id;
    await request(app)
      .get(`/debts/${id}`)
      .expect({
        user_id: 1,
        reason: 'any_reason',
        date: String(date),
        amount: '15.99',
        id: String(id),
      });
  });

  test('Should return a list of debts based on its user', async () => {
    const debtCollection = await MongoHelper.getCollection('debts');
    const firstDebt = await debtCollection.insertOne({
      user_id: 1,
      reason: 'any_reason',
      date: String(date),
      amount: '15.99',
    });

    const secondDebt = await debtCollection.insertOne({
      user_id: 1,
      reason: 'any_reason',
      date: String(date),
      amount: '15.99',
    });

    await request(app)
      .get(`/debts/clients/1`)
      .expect([
        {
          user_id: 1,
          reason: 'any_reason',
          date: String(date),
          amount: '15.99',
          id: String(firstDebt.ops[0]._id),
        },
        {
          user_id: 1,
          reason: 'any_reason',
          date: String(date),
          amount: '15.99',
          id: String(secondDebt.ops[0]._id),
        },
      ]);
  });

  test('Should be able to delete a user', async () => {
    const debtCollection = await MongoHelper.getCollection('debts');
    const debtInDb = await debtCollection.insertOne({
      user_id: 1,
      reason: 'any_reason',
      date: String(date),
      amount: '15.99',
    });

    const id = debtInDb.ops[0]._id;

    await request(app).delete(`/debts/${id}`).expect(200);

    const existsDebtInDb = await debtCollection.findOne({
      _id: new ObjectId(id),
    });

    expect(existsDebtInDb).toBeFalsy();
  });

  test('Should be able to update an debt', async () => {
    const debtCollection = await MongoHelper.getCollection('debts');
    const debtInDb = await debtCollection.insertOne({
      user_id: 1,
      reason: 'any_reason',
      date: String(date),
      amount: '15.99',
    });

    const id = debtInDb.ops[0]._id;

    await request(app)
      .put(`/debts/${id}`)
      .send({
        user_id: 2,
        reason: 'any_reason_updated',
        date: String(date),
        amount: '16.00',
      })
      .expect({
        id: String(id),
        user_id: 2,
        reason: 'any_reason_updated',
        date: String(date),
        amount: '16.00',
      });
  });
});
