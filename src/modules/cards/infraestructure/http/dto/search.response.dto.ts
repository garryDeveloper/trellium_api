import { ApiProperty } from '@nestjs/swagger';
import { BoardResponseDto } from 'src/modules/boards/infrastructure/http/dto/board.response.dto';
import { CardResponseDto } from './card.response.dto';

export class SearchCardHitResponseDto {
  @ApiProperty({ type: CardResponseDto })
  card!: CardResponseDto;

  @ApiProperty()
  listId!: string;

  @ApiProperty()
  listName!: string;

  @ApiProperty()
  boardId!: string;

  @ApiProperty()
  boardName!: string;
}

export class SearchResponseDto {
  @ApiProperty({
    type: [SearchCardHitResponseDto],
    description:
      'Tarjetas encontradas, con el tablero y la lista donde están para poder agruparlas y navegar hasta ellas.',
  })
  cards!: SearchCardHitResponseDto[];

  @ApiProperty({ type: [BoardResponseDto] })
  boards!: BoardResponseDto[];
}
