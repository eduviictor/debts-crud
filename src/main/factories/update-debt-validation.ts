import { DateValidatorAdapter } from '@/infra/validators/date-validator-adapter';
import { Validation } from '@/presentation/protocols/validation';
import { DateValidation } from '@/utils/validators/date-validation';
import { ValidationComposite } from '@/utils/validators/validation-composite';

export const makeUpdateDebtValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new DateValidation('date', new DateValidatorAdapter()));

  return new ValidationComposite(validations);
};
