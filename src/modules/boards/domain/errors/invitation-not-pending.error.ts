import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when trying to accept or reject an invitation that was already resolved.
 */
export class InvitationNotPendingError extends DomainError {
  readonly code = 'invitation_not_pending';
  readonly httpStatus = 409;

  constructor() {
    super('Esta invitación ya fue resuelta.');
  }
}
