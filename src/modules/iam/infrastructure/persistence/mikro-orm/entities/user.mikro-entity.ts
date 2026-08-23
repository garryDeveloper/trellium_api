import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

export const UserMikroEntity = defineEntity({
  name: 'User',
  tableName: 'users',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    name: p.string(),
    email: p.string().unique(),
    passwordHash: p.string().fieldName('password_hash'),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .fieldName('updated_at')
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type UserMikroEntity = InferEntity<typeof UserMikroEntity>;
