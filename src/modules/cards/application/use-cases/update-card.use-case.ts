import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  ACTIVITY_RECORDER,
  type ActivityRecorderPort,
  type RecordableActivity,
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
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface UpdateCardCommand {
  cardId: string;
  title?: string;
  description?: string | null;
  dueDate?: Date | null;
  currentUserId: string;
}

@Injectable()
export class UpdateCardUseCase implements UseCase<UpdateCardCommand, Card> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(ACTIVITY_RECORDER)
    private readonly activities: ActivityRecorderPort,
  ) {}

  async execute(command: UpdateCardCommand): Promise<Card> {
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

    const updated = card.update({
      title: command.title,
      description: command.description,
      dueDate: command.dueDate,
    });

    const saved = await this.cards.update(updated);

    /*
      Un PATCH puede tocar título, descripción y fecha en la misma llamada, y
      cada cambio es un evento distinto: el historial se lee como una lista de
      hechos, no de requests. Se compara contra `card` —el estado ANTES del
      update— para no anotar un cambio que no cambió nada.
    */
    const events: RecordableActivity[] = [];
    const context = {
      boardId: list.boardId,
      cardId: card.id,
      actorUserId: command.currentUserId,
    };

    if (command.title !== undefined && command.title !== card.title) {
      events.push({
        ...context,
        detail: {
          type: 'card_renamed',
          cardTitle: saved.title,
          previousTitle: card.title,
        },
      });
    }

    if (
      command.description !== undefined &&
      (command.description ?? null) !== card.description
    ) {
      events.push({
        ...context,
        detail: {
          type: 'card_described',
          cardTitle: saved.title,
          cleared: !command.description?.trim(),
        },
      });
    }

    const previousDueTime = card.dueDate?.getTime() ?? null;
    const nextDueTime = command.dueDate?.getTime() ?? null;
    if (command.dueDate !== undefined && nextDueTime !== previousDueTime) {
      events.push({
        ...context,
        detail: command.dueDate
          ? {
              type: 'due_date_set',
              cardTitle: saved.title,
              dueDate: command.dueDate.toISOString(),
            }
          : { type: 'due_date_cleared', cardTitle: saved.title },
      });
    }

    await this.activities.record(events);

    return saved;
  }
}
