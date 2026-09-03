import { DomainError } from '../../../../shared/domain/domain-error';

export class UserNotAuthorMemberError extends DomainError {
  readonly code = 'not_the_author_member';
  readonly httpStatus = 422;

  constructor() {
    super('El usuario no es el autor del comentario.');
  }
}
