import { ActivityWithActor } from 'src/modules/activities/domain/ports/activity.repository';
import { ActivityResponseDto } from '../dto/activity.response.dto';

export class ActivityResponseMapper {
  static toResponseDto({
    activity,
    actor,
  }: ActivityWithActor): ActivityResponseDto {
    return {
      id: activity.id,
      type: activity.type,
      boardId: activity.boardId,
      cardId: activity.cardId,
      actor: actor
        ? { id: actor.id, name: actor.name, email: actor.email }
        : null,
      payload: activity.payload,
      createdAt: activity.createdAt.toISOString(),
    };
  }
}
