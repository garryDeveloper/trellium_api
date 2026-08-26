import { Board } from '../entities/board.entity';
import { BoardMember } from '../entities/board-member.entity';

export interface BoardMembershipSummary {
  id: string;
  name: string;
  ownerId: string;
  status: 'active' | 'archived';
  createdAt: Date;
  role: 'owner' | 'member';
  memberCount: number;
}

export interface BoardRepository {
  create(board: Board): Promise<Board>;
  addMember(member: BoardMember): Promise<BoardMember>;
  findAllForMember(
    userId: string,
    status: 'active' | 'archived',
  ): Promise<BoardMembershipSummary[]>;
}

export const BOARD_REPOSITORY = Symbol('BOARD_REPOSITORY');
