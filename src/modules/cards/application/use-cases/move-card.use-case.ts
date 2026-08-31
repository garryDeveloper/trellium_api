import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Card } from '../../domain/entities/card.entity';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import { ListNotInSameBoardError } from '../../domain/errors/list-not-in-same-board.error';
import {
  LIST_REPOSITORY,
  type ListRepository,
} from 'src/modules/lists/domain/ports/list.repository';
import { ListNotFoundError } from 'src/modules/lists/domain/errors/list-not-found.error';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface MoveCardCommand {
  cardId: string;
  listId: string;
  position: number;
  currentUserId: string;
}

@Injectable()
export class MoveCardUseCase implements UseCase<MoveCardCommand, Card> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: MoveCardCommand): Promise<Card> {
    const card = await this.cards.findById(command.cardId);
    if (!card) {
      throw new CardNotFoundError();
    }

    const sourceList = await this.lists.findById(card.listId);
    if (!sourceList) {
      throw new CardNotFoundError();
    }

    const isMember = await this.boards.isMember(
      sourceList.boardId,
      command.currentUserId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const destinationList = await this.lists.findById(command.listId);
    if (!destinationList) {
      throw new ListNotFoundError();
    }

    if (destinationList.boardId !== sourceList.boardId) {
      throw new ListNotInSameBoardError();
    }

    if (destinationList.id === sourceList.id) {
      const totalCards = await this.cards.countByList(sourceList.id);
      const targetPosition = Math.min(
        Math.max(command.position, 1),
        totalCards,
      );

      if (targetPosition === card.position) {
        return card;
      }

      await this.cards.shiftPositionsInList(
        sourceList.id,
        card.position,
        targetPosition,
      );

      return this.cards.update(
        card.moveTo({ listId: sourceList.id, position: targetPosition }),
      );
    }

    const totalInDestination = await this.cards.countByList(destinationList.id);
    const targetPosition = Math.min(
      Math.max(command.position, 1),
      totalInDestination + 1,
    );

    await this.cards.shiftPositionsAfterRemoval(sourceList.id, card.position);
    await this.cards.shiftPositionsForInsertion(
      destinationList.id,
      targetPosition,
    );

    return this.cards.update(
      card.moveTo({ listId: destinationList.id, position: targetPosition }),
    );
  }
}
