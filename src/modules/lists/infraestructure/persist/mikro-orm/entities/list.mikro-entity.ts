import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { randomUUID } from "crypto";
import { BoardMikroEntity } from "src/modules/boards/infrastructure/persistence/mikro-orm/entities/board.mikro-entity";

export const ListMikroEntity = defineEntity({
  name: 'List',
  tableName: 'lists',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    name: p.string(),
    position: p.integer().fieldName('position'),
    board: p
          .manyToOne(BoardMikroEntity)
          .fieldName('board_id')
          .deleteRule('cascade'),
    status: p.enum(['active', 'archived']).fieldName('status').default('active'),
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

export type ListMikroEntity = InferEntity<typeof ListMikroEntity>;