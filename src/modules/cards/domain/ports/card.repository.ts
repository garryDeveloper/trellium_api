import { Card } from '../entities/card.entity';
import { CardAssignee } from '../entities/card-assignee.entity';
import { CardLabel } from '../entities/card-label.entity';

export interface AssigneeInfo {
  userId: string;
  name: string;
  email: string;
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
}

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY');
