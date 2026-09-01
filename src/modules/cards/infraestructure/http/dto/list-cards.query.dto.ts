import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class ListCardsQueryDto {
  @ApiPropertyOptional({ enum: ['active', 'archived'], default: 'active' })
  @IsOptional()
  @IsIn(['active', 'archived'])
  status?: 'active' | 'archived';
}
