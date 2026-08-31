import { DomainError } from '../../../../shared/domain/domain-error';

export class CardNotArchivedError extends DomainError {
  readonly code = 'card_not_archived';
  readonly httpStatus = 409;

  constructor() {
    super('La tarjeta debe estar archivada para poder eliminarse.');
  }
}
