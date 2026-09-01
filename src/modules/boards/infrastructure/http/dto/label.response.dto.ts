import { ApiProperty } from '@nestjs/swagger';

export class LabelResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  boardId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  color!: string;
}
