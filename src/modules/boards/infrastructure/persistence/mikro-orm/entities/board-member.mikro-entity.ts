import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';
import { BoardMikroEntity } from './board.mikro-entity';
import { UserMikroEntity } from '../../../../../iam/infrastructure/persistence/mikro-orm/entities/user.mikro-entity';

export const BoardMemberMikroEntity = defineEntity({
  name: 'BoardMember',
  tableName: 'board_members',
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
    joinedAt: p
      .datetime()
      .fieldName('joined_at')
      .onCreate(() => new Date()),
  },
});

export type BoardMemberMikroEntity = InferEntity<typeof BoardMemberMikroEntity>;
