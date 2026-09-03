import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import {
  AssigneeInfo,
  CardLabelInfo,
  CardRepository,
} from 'src/modules/cards/domain/ports/card.repository';
import { CardMikroEntity } from '../entities/card.mikro-entity';
import { CardAssigneeMikroEntity } from '../entities/card_assignees.mikro-entity';
import { CardLabelMikroEntity } from '../entities/card_labels.mikro-entity';
import { Card } from 'src/modules/cards/domain/entities/card.entity';
import { CardAssignee } from 'src/modules/cards/domain/entities/card-assignee.entity';
import { CardLabel } from 'src/modules/cards/domain/entities/card-label.entity';
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

  async findBoardIdByCard(cardId: string): Promise<string | null> {
    const [row] = await this.em.getConnection().execute<{ boardId: string }[]>(
      `select l.board_id as "boardId"
           from cards c
           join lists l on l.id = c.list_id
          where c.id = ?`,
      [cardId],
    );

    return row?.boardId ?? null;
  }

  async findByListAndStatus(
    listId: string,
    status: 'active' | 'archived',
  ): Promise<Card[]> {
    const entities = await this.em.find(
      CardMikroEntity,
      { list: listId, status },
      {
        orderBy:
          status === 'archived' ? { archivedAt: 'desc' } : { position: 'asc' },
      },
    );
    return entities.map((entity) => CardMapper.toDomain(entity));
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

  async findAssigneesByCards(
    cardIds: string[],
  ): Promise<Map<string, AssigneeInfo[]>> {
    const grouped = new Map<string, AssigneeInfo[]>();
    if (cardIds.length === 0) {
      return grouped;
    }

    const rows = await this.em.find(
      CardAssigneeMikroEntity,
      { card: { $in: cardIds } },
      { populate: ['user'], orderBy: { assignedAt: 'asc' } },
    );

    for (const row of rows) {
      const assignees = grouped.get(row.card.id) ?? [];
      assignees.push({
        userId: row.user.id,
        name: row.user.name,
        email: row.user.email,
      });
      grouped.set(row.card.id, assignees);
    }

    return grouped;
  }

  async isAssigned(cardId: string, userId: string): Promise<boolean> {
    const row = await this.em.findOne(CardAssigneeMikroEntity, {
      card: cardId,
      user: userId,
    });

    return row !== null;
  }

  async applyLabel(cardLabel: CardLabel): Promise<CardLabel> {
    const row = this.em.create(
      CardLabelMikroEntity,
      CardMapper.cardLabelToPersistence(cardLabel),
    );
    await this.em.persist(row).flush();
    return CardMapper.cardLabelToDomain(row);
  }

  async removeLabel(cardId: string, labelId: string): Promise<void> {
    await this.em.nativeDelete(CardLabelMikroEntity, {
      card: cardId,
      label: labelId,
    });
  }

  async findLabelsByCards(
    cardIds: string[],
  ): Promise<Map<string, CardLabelInfo[]>> {
    const grouped = new Map<string, CardLabelInfo[]>();
    if (cardIds.length === 0) {
      return grouped;
    }

    const rows = await this.em.find(
      CardLabelMikroEntity,
      { card: { $in: cardIds } },
      { populate: ['label', 'label.board'] },
    );

    for (const row of rows) {
      const labels = grouped.get(row.card.id) ?? [];
      labels.push({
        id: row.label.id,
        boardId: row.label.board.id,
        name: row.label.name,
        color: row.label.color,
      });
      grouped.set(row.card.id, labels);
    }

    return grouped;
  }

  async isLabelApplied(cardId: string, labelId: string): Promise<boolean> {
    const row = await this.em.findOne(CardLabelMikroEntity, {
      card: cardId,
      label: labelId,
    });

    return row !== null;
  }

  async deleteCard(cardId: string): Promise<void> {
    await this.em.nativeDelete(CardMikroEntity, { id: cardId });
  }
}
