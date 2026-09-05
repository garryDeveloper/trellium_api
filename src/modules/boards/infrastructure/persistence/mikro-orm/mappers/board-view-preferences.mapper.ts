import { BoardViewPreferences } from '../../../../domain/entities/board-view-preferences.entity';
import { BoardViewPreferencesMikroEntity } from '../entities/board-view-preferences.mikro-entity';

export class BoardViewPreferencesMapper {
  static toDomain(
    entity: BoardViewPreferencesMikroEntity,
  ): BoardViewPreferences {
    return BoardViewPreferences.fromPersistence({
      boardId: entity.board.id,
      userId: entity.user.id,
      view: entity.view,
      groupBy: entity.groupBy,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(preferences: BoardViewPreferences) {
    return {
      board: preferences.boardId,
      user: preferences.userId,
      view: preferences.view,
      groupBy: preferences.groupBy,
      updatedAt: preferences.updatedAt,
    };
  }
}
