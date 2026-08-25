import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

export const BoardMikroEntity = defineEntity({
  name: 'Board',
  tableName: 'boards',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    name: p.string(),
    ownerId: p.uuid().fieldName('owner_id'),
    status: p.enum(['active', 'archived']).fieldName('status'),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .fieldName('updated_at')
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
    archivedAt: p.datetime().fieldName('archived_at').nullable(),
  },
});

export type BoardMikroEntity = InferEntity<typeof BoardMikroEntity>;
