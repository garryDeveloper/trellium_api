import { DomainError } from '../../../../shared/domain/domain-error';

export class NotificationNotFoundError extends DomainError {
  readonly code = 'notification_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('La notificación no existe.');
  }
}
