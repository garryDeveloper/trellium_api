import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
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
import { ListNotArchivedError } from '../../domain/errors/list-not-archived.error';

interface DeleteListCommand {
  listId: string;
  currentUserId: string;
}

@Injectable()
export class DeleteListUseCase implements UseCase<DeleteListCommand, void> {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: DeleteListCommand): Promise<void> {
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

    if (list.status !== 'archived') {
      throw new ListNotArchivedError();
    }

    await this.lists.deleteList(command.listId);
  }
}
