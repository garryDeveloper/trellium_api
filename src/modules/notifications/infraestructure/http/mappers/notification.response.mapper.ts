import { NotificationWithAvailability } from '../../../domain/notification-availability';
import { NotificationResponseDto } from '../dto/notification.response.dto';

export class NotificationResponseMapper {
  static toResponseDto({
    notification,
    availability,
  }: NotificationWithAvailability): NotificationResponseDto {
    return {
      id: notification.id,
      type: notification.type,
      actorName: notification.actorName,
      boardId: notification.boardId,
      boardName: notification.boardName,
      cardId: notification.cardId,
      cardTitle: notification.cardTitle,
      availability,
      isRead: notification.isRead,
      readAt: notification.readAt ? notification.readAt.toISOString() : null,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
