import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  ACTIVITY_RECORDER,
  type ActivityRecorderPort,
} from 'src/shared/application/ports/activity-recorder.port';
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
import {
  LABEL_REPOSITORY,
  type LabelRepository,
} from 'src/modules/boards/domain/ports/label.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface RemoveLabelCommand {
  cardId: string;
  labelId: string;
  currentUserId: string;
}

@Injectable()
export class RemoveLabelUseCase implements UseCase<RemoveLabelCommand, Card> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(LABEL_REPOSITORY) private readonly labels: LabelRepository,
    @Inject(ACTIVITY_RECORDER)
    private readonly activities: ActivityRecorderPort,
  ) {}

  async execute(command: RemoveLabelCommand): Promise<Card> {
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

    const wasApplied = await this.cards.isLabelApplied(
      command.cardId,
      command.labelId,
    );
    // El nombre y el color se leen ANTES de quitarla, y quedan copiados en el
    // evento: la etiqueta puede borrarse del tablero después y el historial
    // tiene que seguir diciendo cuál era (`domain.md`, regla 18).
    const label = wasApplied
      ? await this.labels.findById(command.labelId)
      : null;

    await this.cards.removeLabel(command.cardId, command.labelId);

    if (wasApplied) {
      await this.activities.record([
        {
          boardId: list.boardId,
          cardId: card.id,
          actorUserId: command.currentUserId,
          detail: {
            type: 'label_removed',
            cardTitle: card.title,
            labelName: label?.name ?? 'una etiqueta',
            labelColor: label?.color ?? '#D9D9D6',
          },
        },
      ]);
    }

    return card;
  }
}
