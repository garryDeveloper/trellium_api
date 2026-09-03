import { DomainError } from '../../../../shared/domain/domain-error';

export class CommentNotFoundError extends DomainError {
  readonly code = 'comment_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('El comentario no existe.');
  }
}
