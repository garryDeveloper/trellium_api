import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when a user attempts to perform an action on a board they are not a member of.
 */
export class NotBoardMemberError extends DomainError {
  readonly code = 'not_board_member';
  readonly httpStatus = 403;

  constructor() {
    super('Solo un miembro del tablero puede realizar esta acción.');
  }
}
