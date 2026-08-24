import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';

export const RevokedTokenMikroEntity = defineEntity({
  name: 'RevokedToken',
  tableName: 'revoked_tokens',
  properties: {
    jti: p.uuid().primary(),
    expiresAt: p.datetime().fieldName('expires_at'),
  },
});

export type RevokedTokenMikroEntity = InferEntity<
  typeof RevokedTokenMikroEntity
>;
