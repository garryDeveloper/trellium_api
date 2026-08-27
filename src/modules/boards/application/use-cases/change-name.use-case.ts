import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Board } from '../../domain/entities/board.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';

export interface ChangeNameCommand {
  boardId: string;
  name: string;
  userId: string;
}

@Injectable()
export class ChangeNameUseCase implements UseCase<ChangeNameCommand, Board> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: ChangeNameCommand): Promise<Board> {
    const board = await this.boards.findById(command.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    const isMember = await this.boards.isMember(
      command.boardId,
      command.userId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return await this.boards.changeName(command.boardId, command.name);
  }
}
