import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';
import { UserMikroEntity } from '../../../../../iam/infrastructure/persistence/mikro-orm/entities/user.mikro-entity';
import { CardMikroEntity } from './card.mikro-entity';

export const CardAssigneeMikroEntity = defineEntity({
  name: 'CardAssignee',
  tableName: 'card_assignees',
  properties: {
    card: p
      .manyToOne(CardMikroEntity)
      .primary()
      .fieldName('card_id')
      .deleteRule('cascade'),
    user: p
      .manyToOne(UserMikroEntity)
      .primary()
      .fieldName('user_id')
      .deleteRule('cascade'),
    assignedAt: p
      .datetime()
      .fieldName('assigned_at')
      .onCreate(() => new Date()),
  },
});

export type CardAssigneeMikroEntity = InferEntity<
  typeof CardAssigneeMikroEntity
>;
