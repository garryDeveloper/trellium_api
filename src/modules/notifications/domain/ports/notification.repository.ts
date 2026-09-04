import { Notification } from '../entities/notification.entity';

export interface NotificationRepository {
  /** Alta en lote: un comentario puede notificar a varios de una sola vez. */
  createMany(notifications: Notification[]): Promise<void>;
  /** De la más reciente a la más antigua (`T9.1`). */
  findByUser(userId: string): Promise<Notification[]>;
  findById(notificationId: string): Promise<Notification | null>;
  update(notification: Notification): Promise<Notification>;
  markAllAsRead(userId: string): Promise<number>;
}

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');
