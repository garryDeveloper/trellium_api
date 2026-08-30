import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when inviting an email that already belongs to a member of the board.
 */
export class AlreadyBoardMemberError extends DomainError {
  readonly code = 'already_member';
  readonly httpStatus = 409;

  constructor() {
    super('Esa persona ya es miembro del tablero.');
  }
}
