import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    enum: ['card_assigned', 'card_commented', 'board_invited'],
  })
  type!: 'card_assigned' | 'card_commented' | 'board_invited';

  @ApiProperty({ description: 'Quién provocó el evento.' })
  actorName!: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: '`null` si el tablero ya no existe.',
  })
  boardId!: string | null;

  @ApiProperty({ description: 'Nombre al momento de generarse.' })
  boardName!: string;

  @ApiProperty({ nullable: true, type: String })
  cardId!: string | null;

  @ApiProperty({ nullable: true, type: String })
  cardTitle!: string | null;

  @ApiProperty({
    enum: ['available', 'deleted', 'no_access'],
    description:
      '`deleted`: el tablero o la tarjeta se eliminaron. `no_access`: existen pero el usuario ya no es miembro del tablero.',
  })
  availability!: 'available' | 'deleted' | 'no_access';

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty({ nullable: true, type: String })
  readAt!: string | null;

  @ApiProperty()
  createdAt!: string;
}

export class ListNotificationsResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  notifications!: NotificationResponseDto[];

  @ApiProperty({ description: 'Para el badge de la campana.' })
  unreadCount!: number;
}
