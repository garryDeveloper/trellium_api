import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Board } from '../../domain/entities/board.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { NotBoardOwnerError } from '../../domain/errors/not-board-owner.error';

export interface ChangeStatusCommand {
  boardId: string;
  status: 'active' | 'archived';
  userId: string;
}

@Injectable()
export class ChangeStatusUseCase implements UseCase<
  ChangeStatusCommand,
  Board
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: ChangeStatusCommand): Promise<Board> {
    const board = await this.boards.findById(command.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.ownerId !== command.userId) {
      throw new NotBoardOwnerError();
    }

    const updated =
      command.status === 'archived' ? board.archive() : board.unarchive();

    return await this.boards.update(updated);
  }
}
