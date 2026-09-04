import { randomUUID } from 'crypto';
import { Entity } from 'src/shared/domain/entity.base';

/** Los tres eventos de `domain.md`, regla 16. */
export type NotificationType =
  'card_assigned' | 'card_commented' | 'board_invited';

export interface NotificationProps {
  id: string;
  /** Destinatario. */
  userId: string;
  type: NotificationType;
  /** Quién provocó el evento. */
  actorId: string;
  actorName: string;
  /** `null` si el tablero se eliminó después. */
  boardId: string | null;
  /** `null` si la tarjeta se eliminó, o si la notificación no refiere a una. */
  cardId: string | null;
  /**
   * Copia del nombre al momento de generar la notificación. Sobrevive al borrado
   * del tablero/tarjeta, que es lo que permite avisar "esto ya no existe" sin
   * perder de qué se trataba (`screens.md` → Notificaciones).
   */
  boardName: string;
  cardTitle: string | null;
  readAt: Date | null;
  createdAt: Date;
}

export class Notification extends Entity<string> {
  private constructor(private readonly props: NotificationProps) {
    super(props.id);
  }

  static create(props: {
    userId: string;
    type: NotificationType;
    actorId: string;
    actorName: string;
    boardId: string;
    boardName: string;
    cardId?: string | null;
    cardTitle?: string | null;
  }): Notification {
    return new Notification({
      id: randomUUID(),
      userId: props.userId,
      type: props.type,
      actorId: props.actorId,
      actorName: props.actorName,
      boardId: props.boardId,
      boardName: props.boardName,
      cardId: props.cardId ?? null,
      cardTitle: props.cardTitle ?? null,
      readAt: null,
      createdAt: new Date(),
    });
  }

  static fromPersistence(props: NotificationProps): Notification {
    return new Notification(props);
  }

  markAsRead(): Notification {
    if (this.props.readAt) {
      return this;
    }
    return new Notification({ ...this.props, readAt: new Date() });
  }

  get userId(): string {
    return this.props.userId;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get actorId(): string {
    return this.props.actorId;
  }

  get actorName(): string {
    return this.props.actorName;
  }

  get boardId(): string | null {
    return this.props.boardId;
  }

  get boardName(): string {
    return this.props.boardName;
  }

  get cardId(): string | null {
    return this.props.cardId;
  }

  get cardTitle(): string | null {
    return this.props.cardTitle;
  }

  get readAt(): Date | null {
    return this.props.readAt;
  }

  get isRead(): boolean {
    return this.props.readAt !== null;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
