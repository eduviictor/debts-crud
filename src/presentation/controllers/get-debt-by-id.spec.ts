import { DebtModel } from '@/domain/models/debt';
import { GetDebtById } from '@/domain/usecases/get-debt-by-id';
import FakeObjectId from 'bson-objectid';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { ServerError } from '../errors/server-error';
import { GetDebtByIdController } from './get-debt-by-id';

const validId = new FakeObjectId();
const date = new Date();

const makeGetDebtById = (): GetDebtById => {
  class GetDebtByIdStub implements GetDebtById {
    async getById(id: string): Promise<DebtModel> {
      const fakeDebt = {
        id: String(validId),
        reason: 'any_reason',
        amount: '15.99',
        user_id: 1,
        date,
      };

      return await new Promise((resolve) => resolve(fakeDebt));
    }
  }
  return new GetDebtByIdStub();
};

interface SutTypes {
  sut: GetDebtByIdController;
  getDebtByIdStub: GetDebtById;
}

const makeSut = (): SutTypes => {
  const getDebtByIdStub = makeGetDebtById();
  const sut = new GetDebtByIdController(getDebtByIdStub);
  return {
    sut,
    getDebtByIdStub,
  };
};

describe('GetDebtById Controller', () => {
  test('Should return 500 if GetDebtById throws', async () => {
    const { sut, getDebtByIdStub } = makeSut();
    jest.spyOn(getDebtByIdStub, 'getById').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()));
    });
    const httpRequest = {
      body: {},
      params: { id: String(validId) },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 200 if all goes well', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {},
      params: {
        id: String(validId),
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: String(validId),
      reason: 'any_reason',
      amount: '15.99',
      user_id: 1,
      date,
    });
  });

  test('Should return 400 if no id param is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {},
      params: {},
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('id'));
  });

  test('Should return 400 if id is not valid', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {},
      params: { id: 'invalid_id' },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('id'));
  });

  test('Should return 404 if not found id', async () => {
    const { sut, getDebtByIdStub } = makeSut();
    jest.spyOn(getDebtByIdStub, 'getById').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => resolve(null));
    });
    const httpRequest = {
      body: {},
      params: { id: String(validId) },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(404);
  });
});
