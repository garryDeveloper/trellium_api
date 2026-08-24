import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import { REVOKED_TOKEN_REPOSITORY } from '../../../domain/ports/revoked-token.repository';
import type { RevokedTokenRepository } from '../../../domain/ports/revoked-token.repository';
import type { TokenPayload } from '../../../application/ports/token-issuer.port';

export type VerifiedTokenPayload = TokenPayload & { iat: number; exp: number };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(REVOKED_TOKEN_REPOSITORY)
    private readonly revokedTokens: RevokedTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest & { user: VerifiedTokenPayload }>();

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: VerifiedTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<VerifiedTokenPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }

    if (await this.revokedTokens.isRevoked(payload.jti)) {
      throw new UnauthorizedException();
    }

    request.user = payload;
    return true;
  }

  private extractToken(request: FastifyRequest): string | undefined {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return undefined;
    }
    return header.slice('Bearer '.length);
  }
}
