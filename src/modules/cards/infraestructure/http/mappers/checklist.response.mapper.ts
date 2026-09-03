import { Checklist } from '../../../domain/entities/checklist.entity';
import { ChecklistItem } from '../../../domain/entities/checklist-item.entity';
import {
  ChecklistItemResponseDto,
  ChecklistResponseDto,
} from '../dto/checklist.response.dto';

export class ChecklistResponseMapper {
  static toResponseDto(
    checklist: Checklist,
    items: ChecklistItem[],
  ): ChecklistResponseDto {
    return {
      id: checklist.id,
      cardId: checklist.cardId,
      name: checklist.name,
      items: items.map((item) => this.toItemResponseDto(item)),
    };
  }

  static toItemResponseDto(item: ChecklistItem): ChecklistItemResponseDto {
    return {
      id: item.id,
      checklistId: item.checklistId,
      text: item.text,
      completed: item.completed,
      position: item.position,
    };
  }
}
