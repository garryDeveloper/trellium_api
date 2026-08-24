export interface TokenPayload {
  sub: string;
  email: string;
  jti: string;
}

export interface TokenIssuerPort {
  issue(payload: Omit<TokenPayload, 'jti'>): Promise<string>;
}

export const TOKEN_ISSUER = Symbol('TOKEN_ISSUER');
