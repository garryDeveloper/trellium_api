/**
 * El detalle de cada evento, con los valores **ya resueltos** en el momento de
 * ocurrir (`data-model.md`): un `card_moved` guarda los nombres de las listas,
 * no sus ids, para que el historial siga siendo legible después de que esa
 * lista se renombre o se elimine (`domain.md`, regla 18).
 *
 * Es una unión discriminada y no un `Record<string, unknown>` a propósito: el
 * payload de cada tipo se escribe en un solo lugar (el caso de uso que lo
 * origina) y se lee en otro (la pantalla), y sin tipos las dos puntas se van
 * separando sin que nada avise.
 */
export type ActivityDetail =
  | { type: 'card_created'; cardTitle: string; listName: string }
  | {
      type: 'card_moved';
      cardTitle: string;
      fromListName: string;
      toListName: string;
    }
  | { type: 'card_renamed'; cardTitle: string; previousTitle: string }
  /** `cleared` distingue "escribió una descripción" de "la borró". */
  | { type: 'card_described'; cardTitle: string; cleared: boolean }
  | { type: 'card_archived'; cardTitle: string }
  | { type: 'card_unarchived'; cardTitle: string }
  | { type: 'assignee_added'; cardTitle: string; memberName: string }
  | { type: 'assignee_removed'; cardTitle: string; memberName: string }
  | {
      type: 'label_applied';
      cardTitle: string;
      labelName: string;
      labelColor: string;
    }
  | {
      type: 'label_removed';
      cardTitle: string;
      labelName: string;
      labelColor: string;
    }
  /** ISO 8601; la pantalla la formatea con el reloj de quien mira. */
  | { type: 'due_date_set'; cardTitle: string; dueDate: string }
  | { type: 'due_date_cleared'; cardTitle: string }
  | { type: 'attachment_added'; cardTitle: string; fileName: string }
  | { type: 'attachment_removed'; cardTitle: string; fileName: string };

export interface RecordableActivity {
  boardId: string;
  /** `null` en eventos de tablero o de lista. */
  cardId: string | null;
  actorUserId: string;
  detail: ActivityDetail;
}

/**
 * Vista angosta que `cards` necesita del módulo de actividad: sólo registrar.
 * Vive en `shared/` por el mismo motivo que `NotificationPublisherPort`, y el
 * adaptador que la implementa vive en `activities`.
 */
export interface ActivityRecorderPort {
  record(activities: RecordableActivity[]): Promise<void>;
}

export const ACTIVITY_RECORDER = Symbol('ACTIVITY_RECORDER');
