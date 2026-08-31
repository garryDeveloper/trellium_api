import { DomainError } from '../../../../shared/domain/domain-error';

export class NotABoardMemberError extends DomainError {
  readonly code = 'not_a_board_member';
  readonly httpStatus = 422;

  constructor() {
    super('El usuario no es miembro del tablero de la tarjeta.');
  }
}
