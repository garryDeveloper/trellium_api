import { DomainError } from '../../../../shared/domain/domain-error';

export class UserNotFoundError extends DomainError {
  readonly code = 'user_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('El usuario no existe.');
  }
}
