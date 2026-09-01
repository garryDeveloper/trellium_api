import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LABEL_COLOR_PALETTE } from '../../../domain/entities/label.entity';

export class CreateLabelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiProperty({ enum: LABEL_COLOR_PALETTE })
  @IsIn(LABEL_COLOR_PALETTE)
  color!: string;
}
