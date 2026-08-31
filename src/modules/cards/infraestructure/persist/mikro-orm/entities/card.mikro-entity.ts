import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { ListMikroEntity } from 'src/modules/lists/infraestructure/persist/mikro-orm/entities/list.mikro-entity';

export const CardMikroEntity = defineEntity({
  name: 'Card',
  tableName: 'cards',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    title: p.string(),
    description: p.string().nullable(),
    position: p.integer().fieldName('position'),
    status: p
      .enum(['active', 'archived'])
      .fieldName('status')
      .default('active'),
    dueDate: p.datetime().fieldName('due_date').nullable(),
    list: p
      .manyToOne(ListMikroEntity)
      .fieldName('list_id')
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
    archivedAt: p.datetime().fieldName('archived_at').nullable(),
  },
});

export type CardMikroEntity = InferEntity<typeof CardMikroEntity>;
