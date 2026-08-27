import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when a user attempts to perform an action on a board they do not own.
 */
export class NotBoardOwnerError extends DomainError {
  readonly code = 'not_board_owner';
  readonly httpStatus = 403;

  constructor() {
    super('Solo el propietario del tablero puede realizar esta acción.');
  }
}
