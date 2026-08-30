import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Board } from '../../domain/entities/board.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { NotBoardOwnerError } from '../../domain/errors/not-board-owner.error';
import { NewOwnerNotMemberError } from '../../domain/errors/new-owner-not-member.error';

export interface TransferOwnershipCommand {
  boardId: string;
  newOwnerId: string;
  userId: string;
}

@Injectable()
export class TransferOwnershipUseCase implements UseCase<
  TransferOwnershipCommand,
  Board
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: TransferOwnershipCommand): Promise<Board> {
    const board = await this.boards.findById(command.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.ownerId !== command.userId) {
      throw new NotBoardOwnerError();
    }

    const isMember = await this.boards.isMember(
      command.boardId,
      command.newOwnerId,
    );
    if (!isMember) {
      throw new NewOwnerNotMemberError();
    }

    return await this.boards.update(
      board.transferOwnershipTo(command.newOwnerId),
    );
  }
}
