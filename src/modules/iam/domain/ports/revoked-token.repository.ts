export interface RevokedTokenRepository {
  revoke(jti: string, expiresAt: Date): Promise<void>;
  isRevoked(jti: string): Promise<boolean>;
  deleteExpired(now: Date): Promise<void>;
}

export const REVOKED_TOKEN_REPOSITORY = Symbol('REVOKED_TOKEN_REPOSITORY');
