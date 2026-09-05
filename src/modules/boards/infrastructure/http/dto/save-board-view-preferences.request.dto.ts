import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  BOARD_GROUP_BY_OPTIONS,
  BOARD_VIEWS,
  type BoardGroupBy,
  type BoardView,
} from '../../../domain/entities/board-view-preferences.entity';

export class SaveBoardViewPreferencesRequestDto {
  @ApiProperty({ enum: BOARD_VIEWS })
  @IsIn(BOARD_VIEWS)
  view!: BoardView;

  @ApiProperty({ enum: BOARD_GROUP_BY_OPTIONS })
  @IsIn(BOARD_GROUP_BY_OPTIONS)
  groupBy!: BoardGroupBy;
}
