import { Card } from '../../../domain/entities/card.entity';
import { CardResponseDto } from '../dto/card.response.dto';

export class CardResponseMapper {
  static toResponseDto(card: Card): CardResponseDto {
    return {
      id: card.id,
      title: card.title,
      description: card.description,
      listId: card.listId,
      status: card.status,
      position: card.position,
      dueDate: card.dueDate ? card.dueDate.toISOString() : null,
      createdAt: card.createdAt.toISOString(),
    };
  }
}
