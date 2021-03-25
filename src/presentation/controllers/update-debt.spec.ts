import { DebtModel } from '@/domain/models/debt';
import { GetDebtById } from '@/domain/usecases/get-debt-by-id';
import { UpdateDebt, UpdateDebtModel } from '@/domain/usecases/update-debt';
import FakeObjectId from 'bson-objectid';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { ServerError } from '../errors/server-error';
import { Validation } from '../protocols/validation';
import { UpdateDebtController } from './update-debt';

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

const makeUpdateDebt = (): UpdateDebt => {
  class UpdateDebtStub implements UpdateDebt {
    async update(id: string, debt: UpdateDebtModel): Promise<DebtModel> {
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
  return new UpdateDebtStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: UpdateDebtController;
  getDebtByIdStub: GetDebtById;
  updateDebtStub: UpdateDebt;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const getDebtByIdStub = makeGetDebtById();
  const updateDebtStub = makeUpdateDebt();
  const validationStub = makeValidation();
  const sut = new UpdateDebtController(
    getDebtByIdStub,
    updateDebtStub,
    validationStub
  );
  return {
    sut,
    getDebtByIdStub,
    updateDebtStub,
    validationStub,
  };
};

describe('UpdateDebt Controller', () => {
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

  test('Should return 500 if UpdateDebt throws', async () => {
    const { sut, updateDebtStub } = makeSut();
    jest.spyOn(updateDebtStub, 'update').mockImplementationOnce(async () => {
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
      body: {
        id: String(validId),
        reason: 'any_reason_updated',
        amount: '15.99',
        user_id: 1,
        date,
      },
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

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest
      .spyOn(validationStub, 'validate')
      .mockImplementationOnce(() => {
        return new Error();
      });

    const httpRequest = {
      body: {
        date: 'any_date',
      },
      params: { id: String(validId) },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
