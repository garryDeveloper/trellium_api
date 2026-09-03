import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateCardDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  // `null` limpia la descripción, así que el trim solo aplica a strings y
  // `@IsOptional()` deja pasar el null sin validar la longitud.
  @ApiPropertyOptional({ nullable: true, type: String, maxLength: 5000 })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(5000)
  description?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String, format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  dueDate?: string | null;
}
