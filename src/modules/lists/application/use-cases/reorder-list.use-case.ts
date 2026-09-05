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

interface ReorderListCommand {
  listId: string;
  position: number;
  currentUserId: string;
}

@Injectable()
export class ReorderListUseCase implements UseCase<ReorderListCommand, List> {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: ReorderListCommand): Promise<List> {
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

    const totalLists = await this.lists.countByBoard(list.boardId);
    const targetPosition = Math.min(Math.max(command.position, 1), totalLists);

    if (targetPosition === list.position) {
      return list;
    }

    await this.lists.shiftPositions(
      list.boardId,
      list.position,
      targetPosition,
    );
    return this.lists.update(list.reorder(targetPosition));
  }
}
