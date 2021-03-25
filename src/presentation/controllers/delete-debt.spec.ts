import { DebtModel } from '@/domain/models/debt';
import { DeleteDebt } from '@/domain/usecases/delete-debt';
import { GetDebtById } from '@/domain/usecases/get-debt-by-id';
import FakeObjectId from 'bson-objectid';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { ServerError } from '../errors/server-error';
import { DeleteDebtController } from './delete-debt';
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

const makeDeleteDebt = (): DeleteDebt => {
  class DeleteDebtStub implements DeleteDebt {
    async delete(id: string): Promise<void> {}
  }
  return new DeleteDebtStub();
};

interface SutTypes {
  sut: DeleteDebtController;
  getDebtByIdStub: GetDebtById;
  deleteDebtStub: DeleteDebt;
}

const makeSut = (): SutTypes => {
  const getDebtByIdStub = makeGetDebtById();
  const deleteDebtStub = makeDeleteDebt();
  const sut = new DeleteDebtController(getDebtByIdStub, deleteDebtStub);
  return {
    sut,
    getDebtByIdStub,
    deleteDebtStub,
  };
};

describe('DeleteDebt Controller', () => {
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

  test('Should return 500 if DeleteDebt throws', async () => {
    const { sut, deleteDebtStub } = makeSut();
    jest.spyOn(deleteDebtStub, 'delete').mockImplementationOnce(async () => {
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
