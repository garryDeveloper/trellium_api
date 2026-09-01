import { Card } from '../../../domain/entities/card.entity';
import {
  AssigneeInfo,
  CardLabelInfo,
} from '../../../domain/ports/card.repository';
import { CardResponseDto } from '../dto/card.response.dto';

export class CardResponseMapper {
  static toResponseDto(
    card: Card,
    assignees: AssigneeInfo[],
    labels: CardLabelInfo[],
  ): CardResponseDto {
    return {
      id: card.id,
      title: card.title,
      description: card.description,
      listId: card.listId,
      status: card.status,
      position: card.position,
      dueDate: card.dueDate ? card.dueDate.toISOString() : null,
      createdAt: card.createdAt.toISOString(),
      assignees: assignees.map((assignee) => ({
        id: assignee.userId,
        name: assignee.name,
        email: assignee.email,
      })),
      labels: labels.map((label) => ({
        id: label.id,
        boardId: label.boardId,
        name: label.name,
        color: label.color,
      })),
    };
  }
}
