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
  USER_DIRECTORY_PORT,
  type UserDirectoryPort,
} from '../ports/user-directory.port';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface UnassignMemberCommand {
  cardId: string;
  userId: string;
  currentUserId: string;
}

@Injectable()
export class UnassignMemberUseCase implements UseCase<
  UnassignMemberCommand,
  Card
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(USER_DIRECTORY_PORT)
    private readonly userDirectory: UserDirectoryPort,
    @Inject(ACTIVITY_RECORDER)
    private readonly activities: ActivityRecorderPort,
  ) {}

  async execute(command: UnassignMemberCommand): Promise<Card> {
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

    const wasAssigned = await this.cards.isAssigned(
      command.cardId,
      command.userId,
    );

    await this.cards.unassignMember(command.cardId, command.userId);

    // Desasignar a quien no estaba asignado es idempotente y no cambió nada:
    // no deja evento.
    if (wasAssigned) {
      const member = await this.userDirectory.findUserById(command.userId);
      await this.activities.record([
        {
          boardId: list.boardId,
          cardId: card.id,
          actorUserId: command.currentUserId,
          detail: {
            type: 'assignee_removed',
            cardTitle: card.title,
            memberName: member?.name ?? 'Alguien',
          },
        },
      ]);
    }

    return card;
  }
}
