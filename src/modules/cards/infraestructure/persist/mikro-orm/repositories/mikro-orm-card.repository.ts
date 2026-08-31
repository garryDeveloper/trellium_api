import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import {
  AssigneeInfo,
  CardRepository,
} from 'src/modules/cards/domain/ports/card.repository';
import { CardMikroEntity } from '../entities/card.mikro-entity';
import { CardAssigneeMikroEntity } from '../entities/card_assignees.mikro-entity';
import { Card } from 'src/modules/cards/domain/entities/card.entity';
import { CardAssignee } from 'src/modules/cards/domain/entities/card-assignee.entity';
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

  async countByList(listId: string): Promise<number> {
    return this.em.count(CardMikroEntity, { list: listId });
  }

  async shiftPositionsInList(
    listId: string,
    fromPosition: number,
    toPosition: number,
  ): Promise<void> {
    if (toPosition === fromPosition) return;

    if (toPosition > fromPosition) {
      await this.em
        .getConnection()
        .execute(
          `update cards set position = position - 1 where list_id = ? and position > ? and position <= ?`,
          [listId, fromPosition, toPosition],
        );
    } else {
      await this.em
        .getConnection()
        .execute(
          `update cards set position = position + 1 where list_id = ? and position >= ? and position < ?`,
          [listId, toPosition, fromPosition],
        );
    }
  }

  async shiftPositionsAfterRemoval(
    listId: string,
    fromPosition: number,
  ): Promise<void> {
    await this.em
      .getConnection()
      .execute(
        `update cards set position = position - 1 where list_id = ? and position > ?`,
        [listId, fromPosition],
      );
  }

  async shiftPositionsForInsertion(
    listId: string,
    atPosition: number,
  ): Promise<void> {
    await this.em
      .getConnection()
      .execute(
        `update cards set position = position + 1 where list_id = ? and position >= ?`,
        [listId, atPosition],
      );
  }

  async assignMember(assignee: CardAssignee): Promise<CardAssignee> {
    const row = this.em.create(
      CardAssigneeMikroEntity,
      CardMapper.assigneeToPersistence(assignee),
    );
    await this.em.persist(row).flush();
    return CardMapper.assigneeToDomain(row);
  }

  async unassignMember(cardId: string, userId: string): Promise<void> {
    await this.em.nativeDelete(CardAssigneeMikroEntity, {
      card: cardId,
      user: userId,
    });
  }

  async findAssignees(cardId: string): Promise<AssigneeInfo[]> {
    const rows = await this.em.find(
      CardAssigneeMikroEntity,
      { card: cardId },
      { populate: ['user'], orderBy: { assignedAt: 'asc' } },
    );

    return rows.map((row) => ({
      userId: row.user.id,
      name: row.user.name,
      email: row.user.email,
    }));
  }

  async isAssigned(cardId: string, userId: string): Promise<boolean> {
    const row = await this.em.findOne(CardAssigneeMikroEntity, {
      card: cardId,
      user: userId,
    });

    return row !== null;
  }

  async deleteCard(cardId: string): Promise<void> {
    await this.em.nativeDelete(CardMikroEntity, { id: cardId });
  }
}
