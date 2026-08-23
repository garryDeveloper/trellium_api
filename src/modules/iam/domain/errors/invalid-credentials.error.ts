import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Un solo error para email inexistente y contraseña incorrecta:
 * evita revelar si un email está registrado (domain.md, regla de negocio de T1.2).
 */
export class InvalidCredentialsError extends DomainError {
  readonly code = 'invalid_credentials';
  readonly httpStatus = 401;

  constructor() {
    super('Email o contraseña incorrectos.');
  }
}
