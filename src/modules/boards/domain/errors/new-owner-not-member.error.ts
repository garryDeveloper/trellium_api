import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when transferring board ownership to a user who is not a member of the board.
 */
export class NewOwnerNotMemberError extends DomainError {
  readonly code = 'not_a_member';
  readonly httpStatus = 422;

  constructor() {
    super('El nuevo propietario debe ser miembro del tablero.');
  }
}
