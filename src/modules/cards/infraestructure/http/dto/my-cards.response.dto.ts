import { ApiProperty } from '@nestjs/swagger';
import { CardResponseDto } from './card.response.dto';

export class MyCardResponseDto {
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

export class MyCardsResponseDto {
  @ApiProperty({
    type: [MyCardResponseDto],
    description:
      'Tarjetas activas asignadas al usuario, con el tablero y la lista donde están. Ordenadas por fecha límite (las que no tienen, al final).',
  })
  cards!: MyCardResponseDto[];
}
