export interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenIssuerPort {
  issue(payload: TokenPayload): Promise<string>;
}

export const TOKEN_ISSUER = Symbol('TOKEN_ISSUER');
