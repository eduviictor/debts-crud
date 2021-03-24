import { DateValidator } from '@/utils/protocols/date-validator';
import validator from 'validator';

export class DateValidatorAdapter implements DateValidator {
  isValid(date: string): boolean {
    return validator.isDate(date);
  }
}
