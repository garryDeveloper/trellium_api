import { Card } from '../entities/card.entity';
import { CardAssignee } from '../entities/card-assignee.entity';

export interface AssigneeInfo {
  userId: string;
  name: string;
  email: string;
}

export interface CardRepository {
  createCard(card: Card): Promise<Card>;
  getNextPosition(listId: string): Promise<number>;
  findById(cardId: string): Promise<Card | null>;
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
  findAssignees(cardId: string): Promise<AssigneeInfo[]>;
  isAssigned(cardId: string, userId: string): Promise<boolean>;
  deleteCard(cardId: string): Promise<void>;
}

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY');
