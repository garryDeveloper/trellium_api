import { DomainError } from '../../../../shared/domain/domain-error';

export class ListNotInSameBoardError extends DomainError {
  readonly code = 'list_not_in_same_board';
  readonly httpStatus = 422;

  constructor() {
    super('La lista destino pertenece a otro tablero.');
  }
}
