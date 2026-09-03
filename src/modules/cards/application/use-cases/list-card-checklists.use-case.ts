import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import {
  CHECKLIST_REPOSITORY,
  type ChecklistRepository,
  type ChecklistWithItems,
} from '../../domain/ports/checklist.repository';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface ListCardChecklistsQuery {
  cardId: string;
  currentUserId: string;
}

@Injectable()
export class ListCardChecklistsUseCase implements UseCase<
  ListCardChecklistsQuery,
  ChecklistWithItems[]
> {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepository,
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(query: ListCardChecklistsQuery): Promise<ChecklistWithItems[]> {
    const boardId = await this.cards.findBoardIdByCard(query.cardId);
    if (!boardId) {
      throw new CardNotFoundError();
    }

    const isMember = await this.boards.isMember(boardId, query.currentUserId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return this.checklists.findByCardWithItems(query.cardId);
  }
}
