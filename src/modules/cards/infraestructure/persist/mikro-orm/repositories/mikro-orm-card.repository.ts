import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CardRepository } from 'src/modules/cards/domain/ports/card.repository';
import { CardMikroEntity } from '../entities/card.mikro-entity';
import { Card } from 'src/modules/cards/domain/entities/card.entity';
import { CardMapper } from '../mappers/card.mapper';

@Injectable()
export class MikroOrmCardRepository implements CardRepository {
  constructor(private readonly em: EntityManager) {}

  async createCard(card: Card): Promise<Card> {
    const cardEntity = this.em.create(
      CardMikroEntity,
      CardMapper.toPersistence(card),
    );
    await this.em.persist(cardEntity).flush();
    return CardMapper.toDomain(cardEntity);
  }

  async getNextPosition(listId: string): Promise<number> {
    const [row] = await this.em
      .getConnection()
      .execute<{ maxPosition: number | null }[]>(
        `select max(position) as "maxPosition" from cards where list_id = ?`,
        [listId],
      );

    return (row?.maxPosition ?? 0) + 1;
  }

  async findById(cardId: string): Promise<Card | null> {
    const entity = await this.em.findOne(CardMikroEntity, { id: cardId });
    return entity ? CardMapper.toDomain(entity) : null;
  }

  async update(card: Card): Promise<Card> {
    const ref = this.em.getReference(CardMikroEntity, card.id);
    this.em.assign(ref, CardMapper.toPersistence(card));
    await this.em.flush();
    return card;
  }
}
