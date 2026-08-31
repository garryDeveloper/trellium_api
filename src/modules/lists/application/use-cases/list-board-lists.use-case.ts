import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case.interface";
import { List } from "../../domain/entities/list.entity";
import { LIST_REPOSITORY, type ListRepository } from "../../domain/ports/list.repository";
import { BOARD_REPOSITORY, type BoardRepository } from "src/modules/boards/domain/ports/board.repository";
import { NotBoardMemberError } from "src/modules/boards/domain/errors/not-board-member.error";

interface ListBoardListsQuery {
  boardId: string;
  currentUserId: string;
  status?: 'active' | 'archived';
}

@Injectable()
export class ListBoardListsUseCase implements UseCase<ListBoardListsQuery, List[]> {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(query: ListBoardListsQuery): Promise<List[]> {
    const isMember = await this.boards.isMember(query.boardId, query.currentUserId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return this.lists.findByBoardAndStatus(query.boardId, query.status ?? 'active');
  }
}
