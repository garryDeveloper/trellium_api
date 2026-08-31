import { Card } from 'src/modules/cards/domain/entities/card.entity';
import { CardAssignee } from 'src/modules/cards/domain/entities/card-assignee.entity';
import { CardMikroEntity } from '../entities/card.mikro-entity';
import { CardAssigneeMikroEntity } from '../entities/card_assignees.mikro-entity';

export class CardMapper {
  static toDomain(entity: CardMikroEntity): Card {
    return Card.fromPersistence({
      id: entity.id,
      title: entity.title,
      description: entity.description ?? null,
      listId: entity.list.id,
      status: entity.status,
      position: entity.position,
      dueDate: entity.dueDate ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      archivedAt: entity.archivedAt ?? null,
    });
  }

  static toPersistence(card: Card) {
    return {
      id: card.id,
      title: card.title,
      description: card.description,
      list: card.listId,
      status: card.status,
      position: card.position,
      dueDate: card.dueDate,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      archivedAt: card.archivedAt,
    };
  }

  static assigneeToDomain(entity: CardAssigneeMikroEntity): CardAssignee {
    return CardAssignee.fromPersistence({
      cardId: entity.card.id,
      userId: entity.user.id,
      assignedAt: entity.assignedAt,
    });
  }

  static assigneeToPersistence(assignee: CardAssignee) {
    return {
      card: assignee.cardId,
      user: assignee.userId,
      assignedAt: assignee.assignedAt,
    };
  }
}
