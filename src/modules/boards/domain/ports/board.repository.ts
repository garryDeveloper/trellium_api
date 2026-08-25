import { Board } from '../entities/board.entity';
import { BoardMember } from '../entities/board-member.entity';

export interface BoardRepository {
  create(board: Board): Promise<Board>;
  addMember(member: BoardMember): Promise<BoardMember>;
}

export const BOARD_REPOSITORY = Symbol('BOARD_REPOSITORY');
