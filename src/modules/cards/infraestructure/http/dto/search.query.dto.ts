import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export const DEFAULT_SEARCH_LIMIT = 20;
export const MAX_SEARCH_LIMIT = 50;

export class SearchQueryDto {
  @ApiProperty({
    minLength: 2,
    description: 'Texto a buscar en tarjetas y nombres de tablero.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  // El mínimo de dos caracteres es del contrato (`endpoints.md`): con una letra
  // el prefijo hace match con media base y el resultado no le sirve a nadie.
  @MinLength(2)
  q!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  // Llega como texto en la query string; `transform` del ValidationPipe no
  // convierte a boolean por sí solo.
  @Transform(
    ({ value }: { value: unknown }) => value === 'true' || value === true,
  )
  @IsBoolean()
  includeArchived?: boolean;

  @ApiPropertyOptional({
    default: DEFAULT_SEARCH_LIMIT,
    maximum: MAX_SEARCH_LIMIT,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? Number(value) : value,
  )
  @IsInt()
  @Min(1)
  @Max(MAX_SEARCH_LIMIT)
  limit?: number;
}
