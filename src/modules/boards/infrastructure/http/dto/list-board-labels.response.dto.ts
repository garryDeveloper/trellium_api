import { ApiProperty } from '@nestjs/swagger';
import { LabelResponseDto } from './label.response.dto';

export class ListBoardLabelsResponseDto {
  @ApiProperty({ type: [LabelResponseDto] })
  labels!: LabelResponseDto[];
}
