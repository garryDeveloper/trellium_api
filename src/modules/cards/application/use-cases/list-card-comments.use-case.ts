import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
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
import {
  COMMENT_REPOSITORY,
  type CommentRepository,
  type CommentWithAuthor,
} from '../../domain/ports/comment.repository';

interface ListCommentQuery {
  cardId: string;
  currentUserId: string;
}

@Injectable()
export class ListCardCommentsUseCase implements UseCase<
  ListCommentQuery,
  CommentWithAuthor[]
> {
  constructor(
    @Inject(COMMENT_REPOSITORY) private readonly comments: CommentRepository,
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
  ) {}

  async execute(query: ListCommentQuery): Promise<CommentWithAuthor[]> {
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

    return this.comments.findCommentsByCard(query.cardId);
  }
}
