import { DomainError } from '../../../../shared/domain/domain-error';

export class CardNotFoundError extends DomainError {
  readonly code = 'card_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('La tarjeta no existe.');
  }
}
