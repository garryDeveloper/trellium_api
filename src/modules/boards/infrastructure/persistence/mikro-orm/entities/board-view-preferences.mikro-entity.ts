import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';
import { BoardMikroEntity } from './board.mikro-entity';
import { UserMikroEntity } from '../../../../../iam/infrastructure/persistence/mikro-orm/entities/user.mikro-entity';

export const BoardViewPreferencesMikroEntity = defineEntity({
  name: 'BoardViewPreferences',
  tableName: 'board_view_preferences',
  properties: {
    board: p
      .manyToOne(BoardMikroEntity)
      .primary()
      .fieldName('board_id')
      .deleteRule('cascade'),
    user: p
      .manyToOne(UserMikroEntity)
      .primary()
      .fieldName('user_id')
      .deleteRule('cascade'),
    view: p.enum(['board', 'table', 'calendar']).fieldName('view'),
    groupBy: p
      .enum(['list', 'assignee', 'label', 'due_date'])
      .fieldName('group_by'),
    updatedAt: p
      .datetime()
      .fieldName('updated_at')
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type BoardViewPreferencesMikroEntity = InferEntity<
  typeof BoardViewPreferencesMikroEntity
>;
