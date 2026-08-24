import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { RevokedTokenRepository } from '../../../../domain/ports/revoked-token.repository';
import { RevokedTokenMikroEntity } from '../entities/revoked-token.mikro-entity';

@Injectable()
export class MikroOrmRevokedTokenRepository implements RevokedTokenRepository {
  constructor(private readonly em: EntityManager) {}

  async revoke(jti: string, expiresAt: Date): Promise<void> {
    const row = this.em.create(RevokedTokenMikroEntity, { jti, expiresAt });
    await this.em.persist(row).flush();
  }

  async isRevoked(jti: string): Promise<boolean> {
    const row = await this.em.findOne(RevokedTokenMikroEntity, { jti });
    return row !== null;
  }

  async deleteExpired(now: Date): Promise<void> {
    await this.em.nativeDelete(RevokedTokenMikroEntity, {
      expiresAt: { $lt: now },
    });
  }
}
