import { DomainError } from '../../../../shared/domain/domain-error';

export class EmptyAttachmentError extends DomainError {
  readonly code = 'empty_attachment';
  readonly httpStatus = 400;

  constructor() {
    super('No se recibió ningún archivo.');
  }
}
