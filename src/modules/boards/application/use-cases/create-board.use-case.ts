import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Board } from '../../domain/entities/board.entity';
import { BoardMember } from '../../domain/entities/board-member.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';

export interface CreateBoardCommand {
  name: string;
  ownerId: string;
}

@Injectable()
export class CreateBoardUseCase implements UseCase<CreateBoardCommand, Board> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: CreateBoardCommand): Promise<Board> {
    const board = Board.create({
      name: command.name,
      ownerId: command.ownerId,
    });

    const createdBoard = await this.boards.create(board);

    const ownerMembership = BoardMember.create({
      boardId: createdBoard.id,
      userId: createdBoard.ownerId,
    });
    await this.boards.addMember(ownerMembership);

    return createdBoard;
  }
}
