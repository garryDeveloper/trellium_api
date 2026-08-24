import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { REVOKED_TOKEN_REPOSITORY } from '../../domain/ports/revoked-token.repository';
import type { RevokedTokenRepository } from '../../domain/ports/revoked-token.repository';

@Injectable()
export class RevokedTokenCleanupTask {
  constructor(
    @Inject(REVOKED_TOKEN_REPOSITORY)
    private readonly revokedTokens: RevokedTokenRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanup(): Promise<void> {
    await this.revokedTokens.deleteExpired(new Date());
  }
}
