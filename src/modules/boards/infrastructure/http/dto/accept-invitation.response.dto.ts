import { ApiProperty } from '@nestjs/swagger';
import { BoardResponseDto } from './board.response.dto';

export class AcceptInvitationResponseDto {
  @ApiProperty({ type: BoardResponseDto })
  board!: BoardResponseDto;
}
