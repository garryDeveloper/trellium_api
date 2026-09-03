import { ApiProperty } from '@nestjs/swagger';

export class ChecklistItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  checklistId!: string;

  @ApiProperty()
  text!: string;

  @ApiProperty()
  completed!: boolean;

  @ApiProperty()
  position!: number;
}

export class ChecklistResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  cardId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: [ChecklistItemResponseDto] })
  items!: ChecklistItemResponseDto[];
}

export class ListChecklistsResponseDto {
  @ApiProperty({ type: [ChecklistResponseDto] })
  checklists!: ChecklistResponseDto[];
}
