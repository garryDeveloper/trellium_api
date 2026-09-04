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

export interface BoardMemberInfo {
  userId: string;
  name: string;
  email: string;
}

export interface BoardRepository {
  findById(boardId: string): Promise<Board | null>;
  isMember(boardId: string, userId: string): Promise<boolean>;
  /**
   * De los tableros recibidos, cuáles siguen teniendo a `userId` como miembro.
   * En lote porque el listado de notificaciones lo pregunta para todas juntas;
   * de a una sería un N+1.
   */
  filterMemberBoardIds(userId: string, boardIds: string[]): Promise<string[]>;
  update(board: Board): Promise<Board>;
  create(board: Board): Promise<Board>;
  addMember(member: BoardMember): Promise<BoardMember>;
  findMembers(boardId: string): Promise<BoardMemberInfo[]>;
  removeMember(boardId: string, userId: string): Promise<void>;
  findAllForMember(
    userId: string,
    status: 'active' | 'archived',
  ): Promise<BoardMembershipSummary[]>;
  deleteBoard(boardId: string): Promise<void>;
}

export const BOARD_REPOSITORY = Symbol('BOARD_REPOSITORY');
