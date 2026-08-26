import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class ListBoardsQueryDto {
  @ApiPropertyOptional({ enum: ['active', 'archived'], default: 'active' })
  @IsOptional()
  @IsIn(['active', 'archived'])
  status?: 'active' | 'archived';
}
