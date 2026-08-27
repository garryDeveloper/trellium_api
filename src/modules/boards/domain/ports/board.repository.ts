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
  findById(boardId: string): Promise<Board | null>;
  isMember(boardId: string, userId: string): Promise<boolean>;
  changeName(boardId: string, name: string): Promise<Board>;
  changeStatus(boardId: string, status: 'active' | 'archived'): Promise<Board>;
  create(board: Board): Promise<Board>;
  addMember(member: BoardMember): Promise<BoardMember>;
  findAllForMember(
    userId: string,
    status: 'active' | 'archived',
  ): Promise<BoardMembershipSummary[]>;
}

export const BOARD_REPOSITORY = Symbol('BOARD_REPOSITORY');
