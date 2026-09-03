import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { CardMikroEntity } from './card.mikro-entity';
import { UserMikroEntity } from 'src/modules/iam/infrastructure/persistence/mikro-orm/entities/user.mikro-entity';

export const CommentMikroEntity = defineEntity({
  name: 'Comment',
  tableName: 'comments',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    body: p.text(),
    card: p
      .manyToOne(CardMikroEntity)
      .fieldName('card_id')
      .deleteRule('cascade'),
    author: p
      .manyToOne(UserMikroEntity)
      .fieldName('author_id')
      .deleteRule('cascade'),
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

export type CommentMikroEntity = InferEntity<typeof CommentMikroEntity>;
