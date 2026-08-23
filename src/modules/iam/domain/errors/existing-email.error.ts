import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Un solo error para email inexistente y contraseña incorrecta:
 * evita revelar si un email está registrado (domain.md, regla de negocio de T1.2).
 */
export class ExistingEmailError extends DomainError {
  readonly code = 'existing_email';
  readonly httpStatus = 409;

  constructor() {
    super('El email ya está registrado.');
  }
}
