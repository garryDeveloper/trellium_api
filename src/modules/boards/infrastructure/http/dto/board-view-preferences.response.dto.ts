import { ApiProperty } from '@nestjs/swagger';
import {
  BOARD_GROUP_BY_OPTIONS,
  BOARD_VIEWS,
  type BoardGroupBy,
  type BoardView,
} from '../../../domain/entities/board-view-preferences.entity';

export class BoardViewPreferencesResponseDto {
  @ApiProperty({ enum: BOARD_VIEWS })
  view!: BoardView;

  @ApiProperty({ enum: BOARD_GROUP_BY_OPTIONS })
  groupBy!: BoardGroupBy;
}
