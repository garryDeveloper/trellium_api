import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { ChecklistMikroEntity } from './checklist.mikro-entity';

export const ChecklistItemMikroEntity = defineEntity({
  name: 'ChecklistItem',
  tableName: 'checklist_items',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    text: p.string().length(500),
    completed: p.boolean().default(false),
    position: p.integer().fieldName('position'),
    checklist: p
      .manyToOne(ChecklistMikroEntity)
      .fieldName('checklist_id')
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

export type ChecklistItemMikroEntity = InferEntity<
  typeof ChecklistItemMikroEntity
>;
