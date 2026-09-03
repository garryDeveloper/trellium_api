import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';
import { ListNotFoundError } from 'src/modules/lists/domain/errors/list-not-found.error';
import {
  LIST_REPOSITORY,
  type ListRepository,
} from 'src/modules/lists/domain/ports/list.repository';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import {
  ATTACHMENT_REPOSITORY,
  type AttachmentRepository,
  type AttachmentWithUploader,
} from '../../domain/ports/attachment.repository';

interface ListAttachmentsQuery {
  cardId: string;
  currentUserId: string;
}

@Injectable()
export class ListCardAttachmentsUseCase implements UseCase<
  ListAttachmentsQuery,
  AttachmentWithUploader[]
> {
  constructor(
    @Inject(ATTACHMENT_REPOSITORY)
    private readonly attachments: AttachmentRepository,
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
  ) {}

  async execute(
    query: ListAttachmentsQuery,
  ): Promise<AttachmentWithUploader[]> {
    const card = await this.cards.findById(query.cardId);
    if (!card) {
      throw new CardNotFoundError();
    }

    const list = await this.lists.findById(card.listId);
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

    return this.attachments.findAttachmentsByCard(query.cardId);
  }
}
