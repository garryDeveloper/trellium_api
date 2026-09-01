import { Label } from '../../../../domain/entities/label.entity';
import { LabelMikroEntity } from '../entities/label.mikro-entity';

export class LabelMapper {
  static toDomain(entity: LabelMikroEntity): Label {
    return Label.fromPersistence({
      id: entity.id,
      boardId: entity.board.id,
      name: entity.name,
      color: entity.color,
      createdAt: entity.createdAt,
    });
  }

  static toPersistence(label: Label) {
    return {
      id: label.id,
      board: label.boardId,
      name: label.name,
      color: label.color,
      createdAt: label.createdAt,
    };
  }
}
