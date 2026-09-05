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

interface RenameListCommand {
  listId: string;
  name: string;
  currentUserId: string;
}

@Injectable()
export class RenameListUseCase implements UseCase<RenameListCommand, List> {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: RenameListCommand): Promise<List> {
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

    return this.lists.update(list.rename(command.name));
  }
}
