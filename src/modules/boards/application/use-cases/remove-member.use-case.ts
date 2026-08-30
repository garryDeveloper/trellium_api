import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { NotBoardOwnerError } from '../../domain/errors/not-board-owner.error';
import { CannotRemoveOwnerError } from '../../domain/errors/cannot-remove-owner.error';

export interface RemoveMemberCommand {
  boardId: string;
  userId: string;
  requesterId: string;
}

@Injectable()
export class RemoveMemberUseCase implements UseCase<RemoveMemberCommand, void> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: RemoveMemberCommand): Promise<void> {
    const board = await this.boards.findById(command.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.ownerId !== command.requesterId) {
      throw new NotBoardOwnerError();
    }

    if (command.userId === board.ownerId) {
      throw new CannotRemoveOwnerError();
    }

    await this.boards.removeMember(command.boardId, command.userId);
  }
}
