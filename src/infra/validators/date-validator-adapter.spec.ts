import validator from 'validator';
import { DateValidatorAdapter } from './date-validator-adapter';
import faker from 'faker';

jest.mock('validator', () => ({
  isDate(): boolean {
    return true;
  },
}));

const date = faker.date.past().toString();

const makeSut = (): DateValidatorAdapter => {
  return new DateValidatorAdapter();
};

describe('DateValidatorAdapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isDate').mockReturnValueOnce(false);
    const isValid = sut.isValid(date);
    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid(date);
    expect(isValid).toBe(true);
  });

  test('Should call validator with correct date', () => {
    const sut = makeSut();
    const isDateSpy = jest.spyOn(validator, 'isDate');
    sut.isValid(date);
    expect(isDateSpy).toHaveBeenCalledWith(date);
  });
});
