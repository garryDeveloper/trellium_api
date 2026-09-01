import { ApiProperty } from '@nestjs/swagger';

export class CardAssigneeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;
}

export class CardResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ nullable: true, type: String })
  description!: string | null;

  @ApiProperty()
  listId!: string;

  @ApiProperty({ enum: ['active', 'archived'] })
  status!: 'active' | 'archived';

  @ApiProperty()
  position!: number;

  @ApiProperty({ nullable: true, type: String })
  dueDate!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty({ type: [CardAssigneeResponseDto] })
  assignees!: CardAssigneeResponseDto[];
}

export class ListCardsResponseDto {
  @ApiProperty({ type: [CardResponseDto] })
  cards!: CardResponseDto[];
}
