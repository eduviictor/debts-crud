import { DebtModel } from '@/domain/models/debt';
import { AddDebtModel } from '@/domain/usecases/add-debt';
import { AddDebtRepository } from '../../protocols/db/db-add-debt-repository';
import { DbAddDebt } from './db-add-debt';

const date = new Date();

const makeAddDebtsRepository = (): AddDebtRepository => {
  class AddDebtRepositoryStub implements AddDebtRepository {
    async add(debt: AddDebtModel): Promise<DebtModel> {
      const fakeDebt = {
        id: 'valid_id',
        user_id: 1,
        reason: 'any_reason',
        date,
        amount: '15.99',
      };
      return await new Promise((resolve) => resolve(fakeDebt));
    }
  }

  return new AddDebtRepositoryStub();
};

interface SutTypes {
  sut: DbAddDebt;
  addDebtRepositoryStub: AddDebtRepository;
}

const makeSut = (): SutTypes => {
  const addDebtRepositoryStub = makeAddDebtsRepository();
  const sut = new DbAddDebt(addDebtRepositoryStub);
  return {
    sut,
    addDebtRepositoryStub,
  };
};

describe('DbAddDebt Usecase', () => {
  test('Should call AddDebtRepository with correct values', async () => {
    const { sut, addDebtRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addDebtRepositoryStub, 'add');

    const debtData = {
      user_id: 1,
      reason: 'any_reason',
      date,
      amount: '15.99',
    };

    await sut.add(debtData);

    expect(addSpy).toHaveBeenCalledWith({
      user_id: 1,
      reason: 'any_reason',
      date,
      amount: '15.99',
    });
  });

  test('Should return an debt on success', async () => {
    const { sut } = makeSut();

    const debtData = {
      user_id: 1,
      reason: 'any_reason',
      date,
      amount: '15.99',
    };
    const debt = await sut.add(debtData);

    expect(debt).toEqual({
      id: 'valid_id',
      user_id: 1,
      reason: 'any_reason',
      date,
      amount: '15.99',
    });
  });
});
