import { DomainError } from '../../../../shared/domain/domain-error';

export class ListNotFoundError extends DomainError {
  readonly code = 'list_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('La lista no existe.');
  }
}
