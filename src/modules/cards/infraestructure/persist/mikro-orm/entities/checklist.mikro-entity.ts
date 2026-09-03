import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { CardMikroEntity } from './card.mikro-entity';

export const ChecklistMikroEntity = defineEntity({
  name: 'Checklist',
  tableName: 'checklists',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    name: p.string(),
    card: p
      .manyToOne(CardMikroEntity)
      .fieldName('card_id')
      .deleteRule('cascade'),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
  },
});

export type ChecklistMikroEntity = InferEntity<typeof ChecklistMikroEntity>;
