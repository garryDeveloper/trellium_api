import { Inject, Injectable } from '@nestjs/common';
import { BOARD_REPOSITORY } from 'src/modules/boards/domain/ports/board.repository';
import type { BoardRepository } from 'src/modules/boards/domain/ports/board.repository';
import { BoardAccessPort } from '../../application/ports/board-access.port';

@Injectable()
export class BoardsAccessAdapter implements BoardAccessPort {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async filterAccessibleBoardIds(
    userId: string,
    boardIds: string[],
  ): Promise<Set<string>> {
    const accessible = await this.boards.filterMemberBoardIds(userId, boardIds);
    return new Set(accessible);
  }
}
