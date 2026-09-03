import { DomainError } from '../../../../shared/domain/domain-error';

export class ChecklistNotFoundError extends DomainError {
  readonly code = 'checklist_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('La checklist no existe.');
  }
}
