import { Card } from '../entities/card.entity';
import { CardAssignee } from '../entities/card-assignee.entity';
import { CardLabel } from '../entities/card-label.entity';

export interface AssigneeInfo {
  userId: string;
  name: string;
  email: string;
}

/**
 * Una tarjeta con el contexto de dónde vive. Lo necesitan las dos lecturas que
 * cruzan tableros —la búsqueda global (T11.2) y "Mi trabajo" (T12.4)—: las dos
 * muestran de qué tablero y de qué lista viene cada tarjeta, y la tarjeta sola
 * no sabe nada de ninguno de los dos.
 */
export interface CardWithLocation {
  card: Card;
  listName: string;
  boardId: string;
  boardName: string;
}

export interface AssignedCardsCriteria {
  userId: string;
  /** Opcional: acota a un solo tablero (T12.4, filtro por tablero). */
  boardId?: string;
}

export interface CardSearchCriteria {
  userId: string;
  /** Texto tal cual lo escribió el usuario. */
  query: string;
  includeArchived: boolean;
  limit: number;
}

export interface CardLabelInfo {
  id: string;
  boardId: string;
  name: string;
  color: string;
}

export interface CardRepository {
  createCard(card: Card): Promise<Card>;
  getNextPosition(listId: string): Promise<number>;
  findById(cardId: string): Promise<Card | null>;
  /**
   * Tablero dueño de una tarjeta, resuelto con un join contra `lists`. Evita el
   * ida y vuelta tarjeta -> lista -> tablero que necesita cada autorización.
   * Devuelve `null` si la tarjeta no existe.
   */
  findBoardIdByCard(cardId: string): Promise<string | null>;
  findByListAndStatus(
    listId: string,
    status: 'active' | 'archived',
  ): Promise<Card[]>;
  update(card: Card): Promise<Card>;
  countByList(listId: string): Promise<number>;
  shiftPositionsInList(
    listId: string,
    fromPosition: number,
    toPosition: number,
  ): Promise<void>;
  shiftPositionsAfterRemoval(
    listId: string,
    fromPosition: number,
  ): Promise<void>;
  shiftPositionsForInsertion(listId: string, atPosition: number): Promise<void>;
  assignMember(assignee: CardAssignee): Promise<CardAssignee>;
  unassignMember(cardId: string, userId: string): Promise<void>;
  /** Agrupados por `cardId`. Recibe todas las tarjetas juntas para no emitir
   *  una query por tarjeta al listar una lista. */
  findAssigneesByCards(cardIds: string[]): Promise<Map<string, AssigneeInfo[]>>;
  isAssigned(cardId: string, userId: string): Promise<boolean>;
  applyLabel(cardLabel: CardLabel): Promise<CardLabel>;
  removeLabel(cardId: string, labelId: string): Promise<void>;
  /** Agrupadas por `cardId`, por el mismo motivo que `findAssigneesByCards`. */
  findLabelsByCards(cardIds: string[]): Promise<Map<string, CardLabelInfo[]>>;
  isLabelApplied(cardId: string, labelId: string): Promise<boolean>;
  deleteCard(cardId: string): Promise<void>;
  /**
   * Tarjetas que coinciden con el texto, restringidas a los tableros donde
   * `userId` es miembro (T11.2). El filtro de membresía es parte de la query y
   * no un chequeo posterior: no hay forma de que un resultado de un tablero
   * ajeno llegue a materializarse (`domain.md`, regla 2).
   */
  searchForMember(criteria: CardSearchCriteria): Promise<CardWithLocation[]>;
  /**
   * Tarjetas activas asignadas a `userId` en los tableros donde sigue siendo
   * miembro (T12.4). Como en `searchForMember`, la membresía es parte de la
   * query: quedar fuera de un tablero hace desaparecer sus tarjetas de acá sin
   * ningún chequeo posterior (`domain.md`, reglas 2 y 13).
   *
   * Excluye tarjetas archivadas y todo lo que cuelgue de una lista o un tablero
   * archivados.
   */
  findAssignedToMember(
    criteria: AssignedCardsCriteria,
  ): Promise<CardWithLocation[]>;
}

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY');
