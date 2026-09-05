import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class MyCardsQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Acota el resultado a un solo tablero.',
  })
  @IsOptional()
  @IsUUID()
  boardId?: string;
}
