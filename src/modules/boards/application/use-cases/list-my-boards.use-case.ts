import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  BOARD_REPOSITORY,
  BoardMembershipSummary,
} from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';

export interface ListMyBoardsQuery {
  userId: string;
  status: 'active' | 'archived';
}

@Injectable()
export class ListMyBoardsUseCase implements UseCase<
  ListMyBoardsQuery,
  BoardMembershipSummary[]
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(query: ListMyBoardsQuery): Promise<BoardMembershipSummary[]> {
    return this.boards.findAllForMember(query.userId, query.status);
  }
}
