import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Card } from '../../domain/entities/card.entity';
import { CardAssignee } from '../../domain/entities/card-assignee.entity';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import { NotABoardMemberError } from '../../domain/errors/not-a-board-member.error';
import {
  LIST_REPOSITORY,
  type ListRepository,
} from 'src/modules/lists/domain/ports/list.repository';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface AssignMemberCommand {
  cardId: string;
  userId: string;
  currentUserId: string;
}

@Injectable()
export class AssignMemberUseCase implements UseCase<AssignMemberCommand, Card> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: AssignMemberCommand): Promise<Card> {
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

    const isTargetBoardMember = await this.boards.isMember(
      list.boardId,
      command.userId,
    );
    if (!isTargetBoardMember) {
      throw new NotABoardMemberError();
    }

    const alreadyAssigned = await this.cards.isAssigned(
      command.cardId,
      command.userId,
    );
    if (!alreadyAssigned) {
      await this.cards.assignMember(
        CardAssignee.create({ cardId: command.cardId, userId: command.userId }),
      );
    }

    return card;
  }
}
