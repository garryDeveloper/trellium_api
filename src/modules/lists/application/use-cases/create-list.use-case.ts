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

interface CreateListCommand {
  boardId: string;
  name: string;
  currentUserId: string;
}

@Injectable()
export class CreateListUseCase implements UseCase<CreateListCommand, List> {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: CreateListCommand): Promise<List> {
    const isMember = await this.boards.isMember(
      command.boardId,
      command.currentUserId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const nextPosition = await this.lists.getNextPosition(command.boardId);
    const newList = List.create({
      boardId: command.boardId,
      name: command.name,
      position: nextPosition,
    });

    return this.lists.createList(newList);
  }
}
