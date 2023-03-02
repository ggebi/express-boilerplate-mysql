import { ValidationError } from '../helpers/errors.helper';

export const mandatory = () => {
  throw new ValidationError('Missing parameter!');
};
