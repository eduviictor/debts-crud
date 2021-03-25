import { GetDebtByIdRepository } from '@/services/protocols/db/db-get-debt-by-id-repository';
import { DbGetDebtById } from './db-get-debt-by-id';
import { DebtModel } from '@/domain/models/debt';

const date = new Date();

const makeGetDebtByIdRepository = (): GetDebtByIdRepository => {
  class GetDebtByIdRepositoryStub implements GetDebtByIdRepository {
    async getById(id: string): Promise<DebtModel> {
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

  return new GetDebtByIdRepositoryStub();
};

interface SutTypes {
  sut: DbGetDebtById;
  getDebtByIdRepositoryStub: GetDebtByIdRepository;
}

const makeSut = (): SutTypes => {
  const getDebtByIdRepositoryStub = makeGetDebtByIdRepository();
  const sut = new DbGetDebtById(getDebtByIdRepositoryStub);
  return {
    sut,
    getDebtByIdRepositoryStub,
  };
};

describe('DbGetDebtById Usecase', () => {
  test('Should call GetDebtByIdRepository', async () => {
    const { sut, getDebtByIdRepositoryStub } = makeSut();
    const getByIdSpy = jest.spyOn(getDebtByIdRepositoryStub, 'getById');

    await sut.getById('any_id');

    expect(getByIdSpy).toHaveBeenCalledTimes(1);
  });

  test('Should GetDebtByIdRepository return an planet with success', async () => {
    const { sut } = makeSut();

    const planets = await sut.getById('valid_id');

    expect(planets).toEqual({
      id: 'valid_id',
      user_id: 1,
      reason: 'any_reason',
      date,
      amount: '15.99',
    });
  });

  test('Should throw if GetDebtByIdRepository throws', async () => {
    const { sut, getDebtByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getDebtByIdRepositoryStub, 'getById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.getById('any_id');

    await expect(promise).rejects.toThrow();
  });
});
