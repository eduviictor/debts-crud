import { Validation } from '@/presentation/protocols/validation';
import { RequiredFieldValidation } from '@/utils/validators/required-field-validation';
import { ValidationComposite } from '@/utils/validators/validation-composite';

export const makeAddDebtValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['user_id', 'reason', 'amount', 'date']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
