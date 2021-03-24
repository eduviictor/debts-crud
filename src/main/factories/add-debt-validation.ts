import { DateValidatorAdapter } from '@/infra/validators/date-validator-adapter';
import { Validation } from '@/presentation/protocols/validation';
import { DateValidation } from '@/utils/validators/date-validation';
import { RequiredFieldValidation } from '@/utils/validators/required-field-validation';
import { ValidationComposite } from '@/utils/validators/validation-composite';

export const makeAddDebtValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['user_id', 'reason', 'amount', 'date']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new DateValidation('date', new DateValidatorAdapter()));

  return new ValidationComposite(validations);
};
