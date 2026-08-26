import { ApiProperty } from '@nestjs/swagger';
import { BoardResponseDto } from './board.response.dto';

export class BoardListItemResponseDto extends BoardResponseDto {
  @ApiProperty({ enum: ['owner', 'member'] })
  role!: 'owner' | 'member';

  @ApiProperty()
  memberCount!: number;
}

export class ListBoardsResponseDto {
  @ApiProperty({ type: [BoardListItemResponseDto] })
  boards!: BoardListItemResponseDto[];
}
