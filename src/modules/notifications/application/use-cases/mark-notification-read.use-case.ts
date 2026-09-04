import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { NotificationNotFoundError } from '../../domain/errors/notification-not-found.error';
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

interface MarkNotificationReadCommand {
  notificationId: string;
  currentUserId: string;
}

@Injectable()
export class MarkNotificationReadUseCase implements UseCase<
  MarkNotificationReadCommand,
  NotificationWithAvailability
> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
    @Inject(BOARD_ACCESS_PORT)
    private readonly boardAccess: BoardAccessPort,
  ) {}

  async execute(
    command: MarkNotificationReadCommand,
  ): Promise<NotificationWithAvailability> {
    const notification = await this.notifications.findById(
      command.notificationId,
    );

    // Una notificación ajena se responde como inexistente y no como prohibida:
    // así no se filtra que ese id existe para otra persona.
    if (!notification || notification.userId !== command.currentUserId) {
      throw new NotificationNotFoundError();
    }

    // Abrirla la marca leída igual, aunque el destino ya no exista o el
    // usuario haya perdido acceso: la notificación es suya. Lo que devuelve
    // `availability` es si además puede navegar (T9.2).
    const read = notification.isRead
      ? notification
      : await this.notifications.update(notification.markAsRead());

    const accessibleBoardIds = await this.boardAccess.filterAccessibleBoardIds(
      command.currentUserId,
      read.boardId ? [read.boardId] : [],
    );

    return {
      notification: read,
      availability: resolveAvailability(read, accessibleBoardIds),
    };
  }
}
