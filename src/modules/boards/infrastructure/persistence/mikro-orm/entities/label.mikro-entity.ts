import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { BoardMikroEntity } from './board.mikro-entity';

export const LabelMikroEntity = defineEntity({
  name: 'Label',
  tableName: 'labels',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    board: p
      .manyToOne(BoardMikroEntity)
      .fieldName('board_id')
      .deleteRule('cascade'),
    name: p.string(),
    color: p.string(),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
  },
});

export type LabelMikroEntity = InferEntity<typeof LabelMikroEntity>;
