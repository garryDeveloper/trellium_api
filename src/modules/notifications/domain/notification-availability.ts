import { Notification } from './entities/notification.entity';

/**
 * Por qué una notificación puede no llevar a ningún lado (T9.2):
 * - `deleted`: el tablero o la tarjeta se eliminaron.
 * - `no_access`: siguen existiendo, pero el usuario ya no es miembro del tablero.
 *
 * Son dos mensajes distintos para el usuario, así que se distinguen en vez de
 * colapsarlos en un booleano.
 */
export type NotificationAvailability = 'available' | 'deleted' | 'no_access';

export interface NotificationWithAvailability {
  notification: Notification;
  availability: NotificationAvailability;
}

export function resolveAvailability(
  notification: Notification,
  accessibleBoardIds: Set<string>,
): NotificationAvailability {
  // `boardId`/`cardId` en null vienen del `on delete set null` del borrado.
  const referencedContentIsGone =
    notification.boardId === null ||
    (notification.cardTitle !== null && notification.cardId === null);

  if (referencedContentIsGone) {
    return 'deleted';
  }

  return accessibleBoardIds.has(notification.boardId)
    ? 'available'
    : 'no_access';
}
