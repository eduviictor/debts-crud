import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { Validation } from '@/presentation/protocols/validation';
import { DateValidator } from '@/utils/protocols/date-validator';

export class DateValidationAdapter implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly dateValidator: DateValidator
  ) {}

  validate(input: any): Error {
    const isValid = this.dateValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
