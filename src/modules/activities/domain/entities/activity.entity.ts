import { randomUUID } from 'crypto';
import { Entity } from 'src/shared/domain/entity.base';
import type { ActivityDetail } from 'src/shared/application/ports/activity-recorder.port';

/**
 * Los 18 tipos de `data-model.md`. La lista es más larga que lo que hoy se
 * emite: los de lista y `comment_added` los va a escribir el panel de actividad
 * del tablero (T13.2). Están acá desde ahora porque son el contrato de la
 * columna, y agregar un valor al enum después es una migración.
 */
export const ACTIVITY_TYPES = [
  'card_created',
  'card_moved',
  'card_renamed',
  'card_described',
  'card_archived',
  'card_unarchived',
  'assignee_added',
  'assignee_removed',
  'label_applied',
  'label_removed',
  'due_date_set',
  'due_date_cleared',
  'attachment_added',
  'attachment_removed',
  'comment_added',
  'list_created',
  'list_renamed',
  'list_archived',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

/**
 * Lo que quedó guardado en `payload`. Al escribir es una `ActivityDetail`
 * tipada; al leer es un objeto plano, porque una fila vieja puede tener la
 * forma de una versión anterior del evento y el dominio no puede prometer que
 * siga cumpliendo la unión de hoy.
 */
export type ActivityPayload = Record<string, string | boolean | null>;

export interface ActivityProps {
  id: string;
  boardId: string;
  cardId: string | null;
  actorUserId: string;
  type: ActivityType;
  payload: ActivityPayload;
  createdAt: Date;
}

/**
 * Un hecho ocurrido sobre un tablero o una tarjeta.
 *
 * Es inmutable por definición (`domain.md`, regla 17): no tiene ningún método
 * que la modifique, y el repositorio no expone `update` ni `delete`. Se va con
 * la tarjeta o el tablero al que pertenece, por cascada.
 */
export class Activity extends Entity<string> {
  private constructor(private readonly props: ActivityProps) {
    super(props.id);
  }

  static create(props: {
    boardId: string;
    cardId: string | null;
    actorUserId: string;
    detail: ActivityDetail;
  }): Activity {
    const { type, ...payload } = props.detail;

    return new Activity({
      id: randomUUID(),
      boardId: props.boardId,
      cardId: props.cardId,
      actorUserId: props.actorUserId,
      type,
      payload: payload,
      createdAt: new Date(),
    });
  }

  static fromPersistence(props: ActivityProps): Activity {
    return new Activity(props);
  }

  get boardId(): string {
    return this.props.boardId;
  }

  get cardId(): string | null {
    return this.props.cardId;
  }

  get actorUserId(): string {
    return this.props.actorUserId;
  }

  get type(): ActivityType {
    return this.props.type;
  }

  get payload(): ActivityPayload {
    return this.props.payload;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
