import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  BoardViewPreferences,
  type BoardGroupBy,
  type BoardView,
} from '../../domain/entities/board-view-preferences.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { BOARD_VIEW_PREFERENCES_REPOSITORY } from '../../domain/ports/board-view-preferences.repository';
import type { BoardViewPreferencesRepository } from '../../domain/ports/board-view-preferences.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';

export interface SaveBoardViewPreferencesCommand {
  boardId: string;
  userId: string;
  view: BoardView;
  groupBy: BoardGroupBy;
}

@Injectable()
export class SaveBoardViewPreferencesUseCase implements UseCase<
  SaveBoardViewPreferencesCommand,
  BoardViewPreferences
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(BOARD_VIEW_PREFERENCES_REPOSITORY)
    private readonly preferences: BoardViewPreferencesRepository,
  ) {}

  async execute(
    command: SaveBoardViewPreferencesCommand,
  ): Promise<BoardViewPreferences> {
    const isMember = await this.boards.isMember(
      command.boardId,
      command.userId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return await this.preferences.save(
      BoardViewPreferences.create({
        boardId: command.boardId,
        userId: command.userId,
        view: command.view,
        groupBy: command.groupBy,
      }),
    );
  }
}
