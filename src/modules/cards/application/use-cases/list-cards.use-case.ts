import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Card } from '../../domain/entities/card.entity';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import { ListNotFoundError } from 'src/modules/lists/domain/errors/list-not-found.error';
import {
  LIST_REPOSITORY,
  type ListRepository,
} from 'src/modules/lists/domain/ports/list.repository';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface ListCardsQuery {
  listId: string;
  currentUserId: string;
  status?: 'active' | 'archived';
}

@Injectable()
export class ListCardsUseCase implements UseCase<ListCardsQuery, Card[]> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(query: ListCardsQuery): Promise<Card[]> {
    const list = await this.lists.findById(query.listId);
    if (!list) {
      throw new ListNotFoundError();
    }

    const isMember = await this.boards.isMember(
      list.boardId,
      query.currentUserId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return this.cards.findByListAndStatus(
      query.listId,
      query.status ?? 'active',
    );
  }
}
