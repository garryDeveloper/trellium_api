import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';

export const BoardMemberMikroEntity = defineEntity({
  name: 'BoardMember',
  tableName: 'board_members',
  properties: {
    boardId: p.uuid().primary().fieldName('board_id'),
    userId: p.uuid().primary().fieldName('user_id'),
    joinedAt: p
      .datetime()
      .fieldName('joined_at')
      .onCreate(() => new Date()),
  },
});

export type BoardMemberMikroEntity = InferEntity<typeof BoardMemberMikroEntity>;
