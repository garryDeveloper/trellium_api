import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ApplyLabelDto {
  @ApiProperty()
  @IsUUID()
  labelId!: string;
}
