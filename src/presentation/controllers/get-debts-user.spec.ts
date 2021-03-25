import { DebtModel } from '@/domain/models/debt';
import { GetDebtsByUser } from '@/domain/usecases/get-debts-by-user';
import { RequestUserById } from '@/domain/usecases/request-user-by-id';
import { UserResponse } from '@/infra/protocols/json-placeholder';
import FakeObjectId from 'bson-objectid';
import { MissingParamError } from '../errors/missing-param-error';
import { ServerError } from '../errors/server-error';
import { GetDebtsUserController } from './get-debts-user';

const validId = new FakeObjectId();
const date = new Date();

const makeGetDebtsByUser = (): GetDebtsByUser => {
  class GetDebtsByUserStub implements GetDebtsByUser {
    async getByUser(id: string): Promise<DebtModel[]> {
      const fakeDebt = {
        id: String(validId),
        reason: 'any_reason',
        amount: '15.99',
        user_id: 1,
        date,
      };

      return await new Promise((resolve) => resolve([fakeDebt]));
    }
  }
  return new GetDebtsByUserStub();
};

const makeGetUserById = (): RequestUserById => {
  class GetUserByIdStub implements RequestUserById {
    async getById(id: number): Promise<UserResponse> {
      const fakeUser = {
        id: 99,
      };

      return await new Promise((resolve) => resolve(fakeUser));
    }
  }
  return new GetUserByIdStub();
};

interface SutTypes {
  sut: GetDebtsUserController;
  getDebtsByUserStub: GetDebtsByUser;
  getUserByIdStub: RequestUserById;
}

const makeSut = (): SutTypes => {
  const getDebtsByUserStub = makeGetDebtsByUser();
  const getUserByIdStub = makeGetUserById();

  const sut = new GetDebtsUserController(getUserByIdStub, getDebtsByUserStub);
  return {
    sut,
    getDebtsByUserStub,
    getUserByIdStub,
  };
};

describe('GetDebtsUser Controller', () => {
  test('Should return 500 if GetDebtsByUser throws', async () => {
    const { sut, getDebtsByUserStub } = makeSut();
    jest
      .spyOn(getDebtsByUserStub, 'getByUser')
      .mockImplementationOnce(async () => {
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

  test('Should return 404 if user not found', async () => {
    const { sut, getUserByIdStub } = makeSut();
    const getUSerByIdSpy = jest
      .spyOn(getUserByIdStub, 'getById')
      .mockImplementationOnce(() => {
        return null;
      });

    const httpRequest = {
      params: { id: String(validId) },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
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
    expect(httpResponse.body).toEqual([
      {
        id: String(validId),
        reason: 'any_reason',
        amount: '15.99',
        user_id: 1,
        date,
      },
    ]);
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
});
