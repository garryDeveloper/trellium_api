import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TokenIssuerPort,
  TokenPayload,
} from '../../application/ports/token-issuer.port';

@Injectable()
export class JwtTokenIssuerAdapter implements TokenIssuerPort {
  constructor(private readonly jwtService: JwtService) {}

  issue(payload: Omit<TokenPayload, 'jti'>): Promise<string> {
    return this.jwtService.signAsync({ ...payload, jti: randomUUID() });
  }
}
