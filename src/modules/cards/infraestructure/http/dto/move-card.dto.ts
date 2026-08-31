import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class MoveCardDto {
  @ApiProperty()
  @IsUUID()
  listId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  position!: number;
}
