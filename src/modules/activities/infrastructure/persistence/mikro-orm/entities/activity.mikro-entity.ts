import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { BoardMikroEntity } from 'src/modules/boards/infrastructure/persistence/mikro-orm/entities/board.mikro-entity';
import { CardMikroEntity } from 'src/modules/cards/infraestructure/persist/mikro-orm/entities/card.mikro-entity';
import { UserMikroEntity } from 'src/modules/iam/infrastructure/persistence/mikro-orm/entities/user.mikro-entity';
import {
  ACTIVITY_TYPES,
  type ActivityPayload,
} from 'src/modules/activities/domain/entities/activity.entity';

export const ActivityMikroEntity = defineEntity({
  name: 'Activity',
  tableName: 'activities',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    /*
      `cascade` y no `set null` como en `notifications`: el historial es
      información SOBRE el objeto, no un aviso dirigido a una persona, y no
      tiene sentido sin él (`data-model.md`).
    */
    board: p
      .manyToOne(BoardMikroEntity)
      .fieldName('board_id')
      .deleteRule('cascade'),
    card: p
      .manyToOne(CardMikroEntity)
      .fieldName('card_id')
      .nullable()
      .deleteRule('cascade'),
    actor: p
      .manyToOne(UserMikroEntity)
      .fieldName('actor_user_id')
      .deleteRule('cascade'),
    type: p.enum([...ACTIVITY_TYPES]),
    payload: p.json<ActivityPayload>(),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
  },
});

export type ActivityMikroEntity = InferEntity<typeof ActivityMikroEntity>;
