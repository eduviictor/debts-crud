import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { DebtModel } from '@/domain/models/debt';
import { ServerError } from '../errors/server-error';
import { AddDebt, AddDebtModel } from '@/domain/usecases/add-debt';
import { AddDebtController } from './add-debt';
import { Validation } from '../protocols/validation';

const date = new Date();

const makeAddDebt = (): AddDebt => {
  class AddDebtStub implements AddDebt {
    async add(debt: AddDebtModel): Promise<DebtModel> {
      const fakeDebt = {
        id: 'valid_id',
        user_id: 1,
        reason: 'any_reason',
        date,
        amount: '15.00',
      };

      return await new Promise((resolve) => resolve(fakeDebt));
    }
  }
  return new AddDebtStub();
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
  sut: AddDebtController;
  addDebtStub: AddDebt;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const addDebtStub = makeAddDebt();
  const validationStub = makeValidation();
  const sut = new AddDebtController(addDebtStub, validationStub);
  return {
    sut,
    addDebtStub,
    validationStub,
  };
};

describe('AddDebt Controller', () => {
  test('Should call AddDebt with correct values', async () => {
    const { sut, addDebtStub } = makeSut();
    const addSpy = jest.spyOn(addDebtStub, 'add');
    const httpRequest = {
      body: {
        user_id: 1,
        reason: 'any_reason',
        date,
        amount: '15.99',
      },
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      user_id: 1,
      reason: 'any_reason',
      date,
      amount: '15.99',
    });
  });

  test('Should return 500 if AddDebt throws', async () => {
    const { sut, addDebtStub } = makeSut();
    jest.spyOn(addDebtStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()));
    });
    const httpRequest = {
      body: {
        user_id: 1,
        reason: 'any_reason',
        date,
        amount: '15.99',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut, addDebtStub } = makeSut();
    jest.spyOn(addDebtStub, 'add').mockImplementationOnce(async () => {
      return await {
        id: 'valid_id',
        user_id: 2,
        reason: 'valid_reason',
        date,
        amount: '15.99',
      };
    });
    const httpRequest = {
      body: {
        user_id: 2,
        reason: 'valid_reason',
        date,
        amount: '15.99',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      user_id: httpRequest.body.user_id,
      reason: httpRequest.body.reason,
      date: httpRequest.body.date,
      amount: httpRequest.body.amount,
    });
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = {
      body: {
        user_id: 2,
        reason: 'valid_reason',
        date,
        amount: '15.99',
      },
    };

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith({
      user_id: 2,
      reason: 'valid_reason',
      date,
      amount: '15.99',
    });
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
        user_id: 2,
        reason: 'valid_reason',
        date,
        amount: 'invalid_amount',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
