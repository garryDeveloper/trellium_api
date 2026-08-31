import { Card } from 'src/modules/cards/domain/entities/card.entity';
import { CardMikroEntity } from '../entities/card.mikro-entity';

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
}
