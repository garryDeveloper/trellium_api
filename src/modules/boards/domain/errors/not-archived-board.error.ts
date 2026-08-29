import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Error thrown when a user attempts to delete an active board.
 */
export class NotArchivedBoardError extends DomainError {
  readonly code = 'not_archived_board';
  readonly httpStatus = 409;

  constructor() {
    super('El tablero debe estar archivado para poder eliminarse.');
  }
}
