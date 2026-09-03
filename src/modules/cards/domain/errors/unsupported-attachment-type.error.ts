import { DomainError } from '../../../../shared/domain/domain-error';

/** 415: el tipo de archivo no está en la whitelist (`T8.3`). */
export class UnsupportedAttachmentTypeError extends DomainError {
  readonly code = 'unsupported_attachment_type';
  readonly httpStatus = 415;

  constructor(mimeType: string, allowed: string) {
    super(
      `El formato "${mimeType}" no está permitido. Se aceptan: ${allowed}.`,
    );
  }
}
