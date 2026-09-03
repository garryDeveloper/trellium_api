import { DomainError } from '../../../../shared/domain/domain-error';

export class UserNotAuthorizedDeleteCommentError extends DomainError {
  readonly code = 'not_authorized_delete_comment';
  readonly httpStatus = 403;

  constructor() {
    super('El usuario no está autorizado para eliminar este comentario.');
  }
}
