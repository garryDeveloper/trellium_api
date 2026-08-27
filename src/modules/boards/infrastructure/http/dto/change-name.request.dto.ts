import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBoardNameRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;
}
