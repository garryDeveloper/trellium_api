export type PublishableNotificationType =
  'card_assigned' | 'card_commented' | 'board_invited';

export interface PublishableNotification {
  userId: string;
  type: PublishableNotificationType;
  actorId: string;
  actorName: string;
  boardId: string;
  boardName: string;
  cardId?: string | null;
  cardTitle?: string | null;
}

/**
 * Vista angosta que `cards` y `boards` necesitan del módulo de notificaciones:
 * solo publicar. Vive en `shared/` porque la consumen dos módulos con la misma
 * forma; el adaptador que la implementa vive en `notifications`.
 */
export interface NotificationPublisherPort {
  publish(notifications: PublishableNotification[]): Promise<void>;
}

export const NOTIFICATION_PUBLISHER = Symbol('NOTIFICATION_PUBLISHER');
