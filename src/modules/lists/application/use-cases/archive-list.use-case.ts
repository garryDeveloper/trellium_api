import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { List } from '../../domain/entities/list.entity';
import {
  LIST_REPOSITORY,
  type ListRepository,
} from '../../domain/ports/list.repository';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';
import { ListNotFoundError } from '../../domain/errors/list-not-found.error';

interface ArchiveListCommand {
  listId: string;
  currentUserId: string;
}

@Injectable()
export class ArchiveListUseCase implements UseCase<ArchiveListCommand, List> {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: ArchiveListCommand): Promise<List> {
    const list = await this.lists.findById(command.listId);
    if (!list) {
      throw new ListNotFoundError();
    }

    const isMember = await this.boards.isMember(
      list.boardId,
      command.currentUserId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return this.lists.update(list.archive());
  }
}
