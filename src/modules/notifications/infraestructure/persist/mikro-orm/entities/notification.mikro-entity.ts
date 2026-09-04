import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { BoardMikroEntity } from 'src/modules/boards/infrastructure/persistence/mikro-orm/entities/board.mikro-entity';
import { CardMikroEntity } from 'src/modules/cards/infraestructure/persist/mikro-orm/entities/card.mikro-entity';
import { UserMikroEntity } from 'src/modules/iam/infrastructure/persistence/mikro-orm/entities/user.mikro-entity';

export const NotificationMikroEntity = defineEntity({
  name: 'Notification',
  tableName: 'notifications',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    // Destinatario: si se borra la cuenta, sus notificaciones se van con ella.
    user: p
      .manyToOne(UserMikroEntity)
      .fieldName('user_id')
      .deleteRule('cascade'),
    type: p.enum(['card_assigned', 'card_commented', 'board_invited']),
    actor: p
      .manyToOne(UserMikroEntity)
      .fieldName('actor_id')
      .deleteRule('cascade'),
    actorName: p.string().fieldName('actor_name'),
    // `set null`, no `cascade`: la notificación tiene que sobrevivir al borrado
    // del tablero/tarjeta para poder avisar que el contenido ya no existe.
    board: p
      .manyToOne(BoardMikroEntity)
      .fieldName('board_id')
      .nullable()
      .deleteRule('set null'),
    boardName: p.string().fieldName('board_name'),
    card: p
      .manyToOne(CardMikroEntity)
      .fieldName('card_id')
      .nullable()
      .deleteRule('set null'),
    cardTitle: p.string().fieldName('card_title').nullable(),
    readAt: p.datetime().fieldName('read_at').nullable(),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
  },
});

export type NotificationMikroEntity = InferEntity<
  typeof NotificationMikroEntity
>;
