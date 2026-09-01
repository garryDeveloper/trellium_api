import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Label } from '../../domain/entities/label.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { LABEL_REPOSITORY } from '../../domain/ports/label.repository';
import type { LabelRepository } from '../../domain/ports/label.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';

export interface ListBoardLabelsQuery {
  boardId: string;
  userId: string;
}

@Injectable()
export class ListBoardLabelsUseCase implements UseCase<
  ListBoardLabelsQuery,
  Label[]
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(LABEL_REPOSITORY) private readonly labels: LabelRepository,
  ) {}

  async execute(query: ListBoardLabelsQuery): Promise<Label[]> {
    const isMember = await this.boards.isMember(query.boardId, query.userId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return await this.labels.findByBoard(query.boardId);
  }
}
