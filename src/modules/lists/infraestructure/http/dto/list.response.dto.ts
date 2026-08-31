import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  boardId!: string;

  @ApiProperty({ enum: ['active', 'archived'] })
  status!: 'active' | 'archived';

  @ApiProperty()
  position!: number;

  @ApiProperty()
  createdAt!: string;
}

export class ListBoardListsResponseDto {
  @ApiProperty({ type: [ListResponseDto] })
  lists!: ListResponseDto[];
}
