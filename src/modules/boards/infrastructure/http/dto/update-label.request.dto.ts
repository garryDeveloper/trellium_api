import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { LABEL_COLOR_PALETTE } from '../../../domain/entities/label.entity';

export class UpdateLabelRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ enum: LABEL_COLOR_PALETTE })
  @IsOptional()
  @IsIn(LABEL_COLOR_PALETTE)
  color?: string;
}
