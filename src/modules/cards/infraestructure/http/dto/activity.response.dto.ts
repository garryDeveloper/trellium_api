import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ACTIVITY_TYPES } from 'src/modules/activities/domain/entities/activity.entity';

export class ActivityActorResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;
}

export class ActivityResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ACTIVITY_TYPES })
  type!: string;

  @ApiProperty()
  boardId!: string;

  @ApiProperty({ nullable: true })
  cardId!: string | null;

  @ApiPropertyOptional({
    type: ActivityActorResponseDto,
    nullable: true,
    description: 'Null si la cuenta de quien originó el evento ya no existe.',
  })
  actor!: ActivityActorResponseDto | null;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description:
      'Valores del cambio, ya resueltos al momento de ocurrir. Su forma depende de `type`.',
  })
  payload!: Record<string, unknown>;

  @ApiProperty()
  createdAt!: string;
}

export class ListActivitiesResponseDto {
  @ApiProperty({ type: [ActivityResponseDto] })
  activities!: ActivityResponseDto[];
}
