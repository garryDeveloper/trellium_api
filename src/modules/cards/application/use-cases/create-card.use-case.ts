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

interface CreateCardCommand {
  listId: string;
  title: string;
  currentUserId: string;
}

@Injectable()
export class CreateCardUseCase implements UseCase<CreateCardCommand, Card> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(ACTIVITY_RECORDER)
    private readonly activities: ActivityRecorderPort,
  ) {}

  async execute(command: CreateCardCommand): Promise<Card> {
    const list = await this.lists.findById(command.listId);
    if (!list) {
      throw new ListNotFoundError();
    }

    const isMember = await this.boards.isMember(
      list.boardId,
      command.currentUserId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const nextPosition = await this.cards.getNextPosition(command.listId);
    const newCard = Card.create({
      title: command.title,
      listId: command.listId,
      position: nextPosition,
    });

    const created = await this.cards.createCard(newCard);

    await this.activities.record([
      {
        boardId: list.boardId,
        cardId: created.id,
        actorUserId: command.currentUserId,
        detail: {
          type: 'card_created',
          cardTitle: created.title,
          listName: list.name,
        },
      },
    ]);

    return created;
  }
}
