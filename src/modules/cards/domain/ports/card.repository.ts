import { Card } from '../entities/card.entity';

export interface CardRepository {
  createCard(card: Card): Promise<Card>;
  getNextPosition(listId: string): Promise<number>;
  findById(cardId: string): Promise<Card | null>;
  update(card: Card): Promise<Card>;
}

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY');
