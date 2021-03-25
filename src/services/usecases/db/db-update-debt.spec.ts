import { DebtModel } from '@/domain/models/debt';
import { UpdateDebtModel } from '@/domain/usecases/update-debt';
import { UpdateDebtRepository } from '@/services/protocols/db/db-update-debt-repository';
import FakeObjectId from 'bson-objectid';
import { DbUpdateDebt } from './db-update-debt';

const validId = new FakeObjectId();
const date = new Date();

const fakeDebt = {
  id: String(validId),
  reason: 'any_reason',
  amount: '15.99',
  user_id: 1,
  date,
};

const makeUpdateDebtRepository = (): UpdateDebtRepository => {
  class UpdateDebtStub implements UpdateDebtRepository {
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

interface SutTypes {
  sut: DbUpdateDebt;
  updateDebtStub: UpdateDebtRepository;
}

const makeSut = (): SutTypes => {
  const updateDebtStub = makeUpdateDebtRepository();
  const sut = new DbUpdateDebt(updateDebtStub);
  return {
    sut,
    updateDebtStub,
  };
};

describe('DbUpdateDebt Usecase', () => {
  test('Should call UpdateDebtRepository', async () => {
    const { sut, updateDebtStub } = makeSut();
    const getByIdSpy = jest.spyOn(updateDebtStub, 'update');

    await sut.update('any_id', fakeDebt);

    expect(getByIdSpy).toHaveBeenCalledTimes(1);
  });

  test('Should throw if UpdateDebtRepository throws', async () => {
    const { sut, updateDebtStub } = makeSut();
    jest
      .spyOn(updateDebtStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.update('any_id', fakeDebt);

    await expect(promise).rejects.toThrow();
  });
});
