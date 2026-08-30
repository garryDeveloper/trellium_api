import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when there is already a pending invitation for that email on the board.
 */
export class InvitationAlreadyPendingError extends DomainError {
  readonly code = 'invitation_already_pending';
  readonly httpStatus = 409;

  constructor() {
    super('Ya existe una invitación pendiente para ese email en este tablero.');
  }
}
