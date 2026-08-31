import { DomainError } from '../../../../shared/domain/domain-error';

export class ListNotArchivedError extends DomainError {
  readonly code = 'list_not_archived';
  readonly httpStatus = 409;

  constructor() {
    super('La lista debe estar archivada para poder eliminarse.');
  }
}
