import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';

export interface ListBoardMembersQuery {
  boardId: string;
  userId: string;
}

export interface BoardMemberSummary {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'member';
}

@Injectable()
export class ListBoardMembersUseCase implements UseCase<
  ListBoardMembersQuery,
  BoardMemberSummary[]
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(query: ListBoardMembersQuery): Promise<BoardMemberSummary[]> {
    const board = await this.boards.findById(query.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    const isMember = await this.boards.isMember(query.boardId, query.userId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const members = await this.boards.findMembers(query.boardId);

    return members.map((member) => ({
      ...member,
      role: member.userId === board.ownerId ? 'owner' : 'member',
    }));
  }
}
