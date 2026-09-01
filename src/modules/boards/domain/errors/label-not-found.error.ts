import { DomainError } from '../../../../shared/domain/domain-error';

export class LabelNotFoundError extends DomainError {
  readonly code = 'label_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('La etiqueta no existe.');
  }
}
