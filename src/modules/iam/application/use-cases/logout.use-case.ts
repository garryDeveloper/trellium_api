import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { REVOKED_TOKEN_REPOSITORY } from '../../domain/ports/revoked-token.repository';
import type { RevokedTokenRepository } from '../../domain/ports/revoked-token.repository';

export interface LogoutCommand {
  jti: string;
  expiresAt: Date;
}

@Injectable()
export class LogoutUseCase implements UseCase<LogoutCommand, void> {
  constructor(
    @Inject(REVOKED_TOKEN_REPOSITORY)
    private readonly revokedTokens: RevokedTokenRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.revokedTokens.revoke(command.jti, command.expiresAt);
  }
}
