import { Board } from '../../../domain/entities/board.entity';
import { BoardMembershipSummary } from '../../../domain/ports/board.repository';
import { BoardResponseDto } from '../dto/board.response.dto';
import { BoardListItemResponseDto } from '../dto/board-list-item.response.dto';

export class BoardResponseMapper {
  static toResponseDto(board: Board): BoardResponseDto {
    return {
      id: board.id,
      name: board.name,
      ownerId: board.ownerId,
      status: board.status,
      createdAt: board.createdAt.toISOString(),
    };
  }

  static toListItemDto(
    summary: BoardMembershipSummary,
  ): BoardListItemResponseDto {
    return {
      id: summary.id,
      name: summary.name,
      ownerId: summary.ownerId,
      status: summary.status,
      createdAt: summary.createdAt.toISOString(),
      role: summary.role,
      memberCount: summary.memberCount,
    };
  }
}
