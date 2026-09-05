import { Activity } from 'src/modules/activities/domain/entities/activity.entity';
import { ActivityMikroEntity } from '../entities/activity.mikro-entity';

export class ActivityMapper {
  static toDomain(entity: ActivityMikroEntity): Activity {
    return Activity.fromPersistence({
      id: entity.id,
      boardId: entity.board.id,
      cardId: entity.card ? entity.card.id : null,
      actorUserId: entity.actor.id,
      type: entity.type,
      payload: entity.payload,
      createdAt: entity.createdAt,
    });
  }

  static toPersistence(activity: Activity) {
    return {
      id: activity.id,
      board: activity.boardId,
      card: activity.cardId,
      actor: activity.actorUserId,
      type: activity.type,
      payload: activity.payload,
      createdAt: activity.createdAt,
    };
  }
}
