import { DomainError } from '../../../../shared/domain/domain-error';

export class AttachmentNotFoundError extends DomainError {
  readonly code = 'attachment_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('El adjunto no existe.');
  }
}
