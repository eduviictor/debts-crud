import { DateValidator } from '../protocols/date-validator';
import { DateValidation } from './date-validation';
import faker from 'faker';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';

const field = faker.random.word();

const makeDateValidator = (): DateValidator => {
  class DateValidatorStub implements DateValidator {
    isValid(date: string): boolean {
      return true;
    }
  }
  return new DateValidatorStub();
};

type SutTypes = {
  sut: DateValidation;
  dateValidatorStub: DateValidator;
};

const makeSut = (): SutTypes => {
  const dateValidatorStub = makeDateValidator();
  const sut = new DateValidation(field, dateValidatorStub);
  return {
    sut,
    dateValidatorStub,
  };
};

describe('DateValidation', () => {
  test('Should return false if validator returns false', () => {
    const { sut, dateValidatorStub } = makeSut();
    const date = faker.date.past();

    jest.spyOn(dateValidatorStub, 'isValid').mockReturnValueOnce(false);
    const isValid = sut.validate(date);

    expect(isValid).toEqual(new InvalidParamError(field));
  });

  test('Should return true if validator returns true', () => {
    const { sut } = makeSut();
    const date = faker.date.past();

    const isValid = sut.validate(date);

    expect(isValid).toBeUndefined();
  });

  test('Should throw if validator throws', () => {
    const { sut, dateValidatorStub } = makeSut();
    jest.spyOn(dateValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
