import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when a user tries to resolve an invitation addressed to a different email.
 */
export class NotInvitationRecipientError extends DomainError {
  readonly code = 'not_invitation_recipient';
  readonly httpStatus = 403;

  constructor() {
    super('Esta invitación no fue dirigida a tu cuenta.');
  }
}
