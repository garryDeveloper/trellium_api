import { DomainError } from '../../../../shared/domain/domain-error';

export class ChecklistItemNotFoundError extends DomainError {
  readonly code = 'checklist_item_not_found';
  readonly httpStatus = 404;

  constructor() {
    super('El ítem de checklist no existe.');
  }
}
