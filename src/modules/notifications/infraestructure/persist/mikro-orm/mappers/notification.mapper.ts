import { Notification } from 'src/modules/notifications/domain/entities/notification.entity';
import { NotificationMikroEntity } from '../entities/notification.mikro-entity';

export class NotificationMapper {
  static toDomain(entity: NotificationMikroEntity): Notification {
    return Notification.fromPersistence({
      id: entity.id,
      userId: entity.user.id,
      type: entity.type,
      actorId: entity.actor.id,
      actorName: entity.actorName,
      boardId: entity.board ? entity.board.id : null,
      boardName: entity.boardName,
      cardId: entity.card ? entity.card.id : null,
      cardTitle: entity.cardTitle ?? null,
      readAt: entity.readAt ?? null,
      createdAt: entity.createdAt,
    });
  }

  static toPersistence(notification: Notification) {
    return {
      id: notification.id,
      user: notification.userId,
      type: notification.type,
      actor: notification.actorId,
      actorName: notification.actorName,
      board: notification.boardId,
      boardName: notification.boardName,
      card: notification.cardId,
      cardTitle: notification.cardTitle,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }
}
