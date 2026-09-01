import { DomainError } from '../../../../shared/domain/domain-error';

export class LabelNotInSameBoardError extends DomainError {
  readonly code = 'label_not_in_same_board';
  readonly httpStatus = 422;

  constructor() {
    super('La etiqueta pertenece a otro tablero.');
  }
}
