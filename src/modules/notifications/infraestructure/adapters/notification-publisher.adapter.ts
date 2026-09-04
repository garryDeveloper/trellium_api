import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  NotificationPublisherPort,
  PublishableNotification,
} from 'src/shared/application/ports/notification-publisher.port';
import { Notification } from '../../domain/entities/notification.entity';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/ports/notification.repository';

@Injectable()
export class NotificationPublisherAdapter implements NotificationPublisherPort {
  private readonly logger = new Logger(NotificationPublisherAdapter.name);

  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
  ) {}

  /**
   * Notificar es un efecto secundario: si falla, la acción que lo disparó
   * (asignar, comentar, invitar) ya se completó y no tiene por qué romperse.
   * Se loguea y sigue.
   */
  async publish(notifications: PublishableNotification[]): Promise<void> {
    if (notifications.length === 0) {
      return;
    }

    try {
      await this.notifications.createMany(
        notifications.map((notification) => Notification.create(notification)),
      );
    } catch (error) {
      this.logger.error(
        `No se pudieron generar ${notifications.length} notificación(es).`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
