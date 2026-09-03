import { DomainError } from '../../../../shared/domain/domain-error';

/** 413: supera el tamaño máximo permitido (`T8.3`). */
export class AttachmentTooLargeError extends DomainError {
  readonly code = 'attachment_too_large';
  readonly httpStatus = 413;

  constructor(maxBytes: number) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    super(`El archivo supera el máximo de ${maxMb} MB.`);
  }
}
