import { DebtModel } from '@/domain/models/debt';
import { GetDebtsByUserRepository } from '@/services/protocols/db/db-get-debts-by-user-repository';
import { DbGetDebtsByUser } from './db-get-debts-by-user';

const date = new Date();

const makeGetDebtsByUserRepository = (): GetDebtsByUserRepository => {
  class GetDebtsUserRepositoryStub implements GetDebtsByUserRepository {
    async getByUser(id: number): Promise<DebtModel[]> {
      const fakeDebt = {
        id: 'valid_id',
        user_id: 1,
        reason: 'any_reason',
        date,
        amount: '15.99',
      };
      return await new Promise((resolve) => resolve([fakeDebt]));
    }
  }

  return new GetDebtsUserRepositoryStub();
};

interface SutTypes {
  sut: DbGetDebtsByUser;
  getDebtsByUserRepositoryStub: GetDebtsByUserRepository;
}

const makeSut = (): SutTypes => {
  const getDebtsByUserRepositoryStub = makeGetDebtsByUserRepository();
  const sut = new DbGetDebtsByUser(getDebtsByUserRepositoryStub);
  return {
    sut,
    getDebtsByUserRepositoryStub,
  };
};

describe('DbGetDebtsByUser Usecase', () => {
  test('Should call GetDebtsByUserRepository', async () => {
    const { sut, getDebtsByUserRepositoryStub } = makeSut();
    const getByIdSpy = jest.spyOn(getDebtsByUserRepositoryStub, 'getByUser');

    await sut.getByUser('any_id');

    expect(getByIdSpy).toHaveBeenCalledTimes(1);
  });

  test('Should GetDebtsByUserRepository return an debt with success', async () => {
    const { sut } = makeSut();

    const debts = await sut.getByUser('valid_id');

    expect(debts).toEqual([
      {
        id: 'valid_id',
        user_id: 1,
        reason: 'any_reason',
        date,
        amount: '15.99',
      },
    ]);
  });

  test('Should throw if GetDebtsByUserRepository throws', async () => {
    const { sut, getDebtsByUserRepositoryStub } = makeSut();
    jest
      .spyOn(getDebtsByUserRepositoryStub, 'getByUser')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.getByUser('any_id');

    await expect(promise).rejects.toThrow();
  });
});
