import { DomainError } from '../../../../shared/domain/domain-error';

export class UserNotAuthorizedDeleteAttachmentError extends DomainError {
  readonly code = 'not_authorized_delete_attachment';
  readonly httpStatus = 403;

  constructor() {
    super('El usuario no está autorizado para eliminar este adjunto.');
  }
}
