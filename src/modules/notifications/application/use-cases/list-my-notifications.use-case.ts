import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  NotificationWithAvailability,
  resolveAvailability,
} from '../../domain/notification-availability';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/ports/notification.repository';
import {
  BOARD_ACCESS_PORT,
  type BoardAccessPort,
} from '../ports/board-access.port';

interface ListMyNotificationsQuery {
  currentUserId: string;
}

@Injectable()
export class ListMyNotificationsUseCase implements UseCase<
  ListMyNotificationsQuery,
  NotificationWithAvailability[]
> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
    @Inject(BOARD_ACCESS_PORT)
    private readonly boardAccess: BoardAccessPort,
  ) {}

  async execute(
    query: ListMyNotificationsQuery,
  ): Promise<NotificationWithAvailability[]> {
    const notifications = await this.notifications.findByUser(
      query.currentUserId,
    );

    // Una sola consulta de membresía para todos los tableros referenciados, en
    // vez de una por notificación.
    const boardIds = [
      ...new Set(
        notifications
          .map((notification) => notification.boardId)
          .filter((boardId): boardId is string => boardId !== null),
      ),
    ];
    const accessibleBoardIds = await this.boardAccess.filterAccessibleBoardIds(
      query.currentUserId,
      boardIds,
    );

    return notifications.map((notification) => ({
      notification,
      availability: resolveAvailability(notification, accessibleBoardIds),
    }));
  }
}
