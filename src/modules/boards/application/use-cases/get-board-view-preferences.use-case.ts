import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { BoardViewPreferences } from '../../domain/entities/board-view-preferences.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { BOARD_VIEW_PREFERENCES_REPOSITORY } from '../../domain/ports/board-view-preferences.repository';
import type { BoardViewPreferencesRepository } from '../../domain/ports/board-view-preferences.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';

export interface GetBoardViewPreferencesQuery {
  boardId: string;
  userId: string;
}

@Injectable()
export class GetBoardViewPreferencesUseCase implements UseCase<
  GetBoardViewPreferencesQuery,
  BoardViewPreferences
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(BOARD_VIEW_PREFERENCES_REPOSITORY)
    private readonly preferences: BoardViewPreferencesRepository,
  ) {}

  async execute(
    query: GetBoardViewPreferencesQuery,
  ): Promise<BoardViewPreferences> {
    const isMember = await this.boards.isMember(query.boardId, query.userId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const stored = await this.preferences.find(query.boardId, query.userId);

    return stored ?? BoardViewPreferences.defaults(query.boardId, query.userId);
  }
}
