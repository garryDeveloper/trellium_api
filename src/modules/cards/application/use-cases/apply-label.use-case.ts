import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Card } from '../../domain/entities/card.entity';
import { CardLabel } from '../../domain/entities/card-label.entity';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import { LabelNotInSameBoardError } from '../../domain/errors/label-not-in-same-board.error';
import {
  LIST_REPOSITORY,
  type ListRepository,
} from 'src/modules/lists/domain/ports/list.repository';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';
import {
  LABEL_REPOSITORY,
  type LabelRepository,
} from 'src/modules/boards/domain/ports/label.repository';
import { LabelNotFoundError } from 'src/modules/boards/domain/errors/label-not-found.error';

interface ApplyLabelCommand {
  cardId: string;
  labelId: string;
  currentUserId: string;
}

@Injectable()
export class ApplyLabelUseCase implements UseCase<ApplyLabelCommand, Card> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(LABEL_REPOSITORY) private readonly labels: LabelRepository,
  ) {}

  async execute(command: ApplyLabelCommand): Promise<Card> {
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

    const label = await this.labels.findById(command.labelId);
    if (!label) {
      throw new LabelNotFoundError();
    }

    if (label.boardId !== list.boardId) {
      throw new LabelNotInSameBoardError();
    }

    const alreadyApplied = await this.cards.isLabelApplied(
      command.cardId,
      command.labelId,
    );
    if (!alreadyApplied) {
      await this.cards.applyLabel(
        CardLabel.create({ cardId: command.cardId, labelId: command.labelId }),
      );
    }

    return card;
  }
}
