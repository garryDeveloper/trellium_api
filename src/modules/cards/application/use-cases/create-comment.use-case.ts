import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Comment } from '../../domain/entities/comment.entity';
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
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import {
  COMMENT_REPOSITORY,
  type CommentRepository,
  type CommentWithAuthor,
} from '../../domain/ports/comment.repository';

interface CreateCommentCommand {
  cardId: string;
  body: string;
  currentUserId: string;
}

@Injectable()
export class CreateCommentUseCase implements UseCase<
  CreateCommentCommand,
  CommentWithAuthor
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(COMMENT_REPOSITORY) private readonly comments: CommentRepository,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentWithAuthor> {
    const card = await this.cards.findById(command.cardId);
    if (!card) {
      throw new CardNotFoundError();
    }

    const list = await this.lists.findById(card.listId);

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

    const newComment = Comment.create({
      body: command.body,
      cardId: command.cardId,
      authorId: command.currentUserId,
    });

    return this.comments.createComment(newComment);
  }
}
