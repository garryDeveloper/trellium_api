import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { NotBoardOwnerError } from '../../domain/errors/not-board-owner.error';
import { NotArchivedBoardError } from '../../domain/errors/not-archived-board.error';

export interface DeleteBoardCommand {
  boardId: string;
  userId: string;
}

@Injectable()
export class DeleteBoardUseCase implements UseCase<DeleteBoardCommand, void> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: DeleteBoardCommand): Promise<void> {
    const board = await this.boards.findById(command.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.ownerId !== command.userId) {
      throw new NotBoardOwnerError();
    }

    if(board.status !== 'archived') {
      throw new NotArchivedBoardError();
    }

    await this.boards.deleteBoard(command.boardId);
  }
}
