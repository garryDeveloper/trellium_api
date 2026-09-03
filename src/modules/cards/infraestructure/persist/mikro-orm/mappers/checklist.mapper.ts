import { Checklist } from 'src/modules/cards/domain/entities/checklist.entity';
import { ChecklistItem } from 'src/modules/cards/domain/entities/checklist-item.entity';
import { ChecklistMikroEntity } from '../entities/checklist.mikro-entity';
import { ChecklistItemMikroEntity } from '../entities/checklist-item.mikro-entity';

export class ChecklistMapper {
  static toDomain(entity: ChecklistMikroEntity): Checklist {
    return Checklist.fromPersistence({
      id: entity.id,
      name: entity.name,
      cardId: entity.card.id,
      createdAt: entity.createdAt,
    });
  }

  static toPersistence(checklist: Checklist) {
    return {
      id: checklist.id,
      name: checklist.name,
      card: checklist.cardId,
      createdAt: checklist.createdAt,
    };
  }

  static itemToDomain(entity: ChecklistItemMikroEntity): ChecklistItem {
    return ChecklistItem.fromPersistence({
      id: entity.id,
      checklistId: entity.checklist.id,
      text: entity.text,
      completed: entity.completed,
      position: entity.position,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static itemToPersistence(item: ChecklistItem) {
    return {
      id: item.id,
      checklist: item.checklistId,
      text: item.text,
      completed: item.completed,
      position: item.position,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
