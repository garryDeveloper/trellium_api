import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Card } from '../../domain/entities/card.entity';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import {
  LIST_REPOSITORY,
  type ListRepository,
} from 'src/modules/lists/domain/ports/list.repository';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface UnarchiveCardCommand {
  cardId: string;
  currentUserId: string;
}

@Injectable()
export class UnarchiveCardUseCase implements UseCase<
  UnarchiveCardCommand,
  Card
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: UnarchiveCardCommand): Promise<Card> {
    const card = await this.cards.findById(command.cardId);
    if (!card) {
      throw new CardNotFoundError();
    }

    const list = await this.lists.findById(card.listId);
    if (!list) {
      throw new CardNotFoundError();
    }

    const isMember = await this.boards.isMember(
      list.boardId,
      command.currentUserId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return this.cards.update(card.unarchive());
  }
}
