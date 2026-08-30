import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when trying to remove the board owner from its own board's membership.
 */
export class CannotRemoveOwnerError extends DomainError {
  readonly code = 'cannot_remove_owner';
  readonly httpStatus = 422;

  constructor() {
    super('El propietario no puede ser removido del tablero.');
  }
}
