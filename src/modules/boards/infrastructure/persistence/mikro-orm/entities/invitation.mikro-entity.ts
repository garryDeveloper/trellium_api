import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { BoardMikroEntity } from './board.mikro-entity';
import { UserMikroEntity } from '../../../../../iam/infrastructure/persistence/mikro-orm/entities/user.mikro-entity';

export const InvitationMikroEntity = defineEntity({
  name: 'Invitation',
  tableName: 'invitations',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    board: p
      .manyToOne(BoardMikroEntity)
      .fieldName('board_id')
      .deleteRule('cascade'),
    invitedEmail: p.string().fieldName('invited_email'),
    invitedBy: p.manyToOne(UserMikroEntity).fieldName('invited_by_user_id'),
    status: p.enum(['pending', 'accepted', 'rejected']).fieldName('status'),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
    resolvedAt: p.datetime().fieldName('resolved_at').nullable(),
  },
});

export type InvitationMikroEntity = InferEntity<typeof InvitationMikroEntity>;
