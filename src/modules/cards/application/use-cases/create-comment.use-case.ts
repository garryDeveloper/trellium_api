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
import {
  NOTIFICATION_PUBLISHER,
  type NotificationPublisherPort,
} from 'src/shared/application/ports/notification-publisher.port';
import {
  USER_DIRECTORY_PORT,
  type UserDirectoryPort,
} from '../ports/user-directory.port';

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
    @Inject(NOTIFICATION_PUBLISHER)
    private readonly notifications: NotificationPublisherPort,
    @Inject(USER_DIRECTORY_PORT)
    private readonly userDirectory: UserDirectoryPort,
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

    // Los autores previos se leen ANTES de insertar, para que el comentario
    // recién creado no cuente como "comentario previo" del propio autor.
    const previousAuthorIds = await this.comments.findDistinctAuthorIdsByCard(
      command.cardId,
    );

    const created = await this.comments.createComment(newComment);

    await this.notifyParticipants(
      command,
      list.boardId,
      card.title,
      previousAuthorIds,
    );

    return created;
  }

  /**
   * Regla 16 de `domain.md`: se notifica a los participantes de la tarjeta
   * —asignados y autores de comentarios previos— menos a quien comenta.
   */
  private async notifyParticipants(
    command: CreateCommentCommand,
    boardId: string,
    cardTitle: string,
    previousAuthorIds: string[],
  ): Promise<void> {
    const assigneesByCard = await this.cards.findAssigneesByCards([
      command.cardId,
    ]);
    const assigneeIds = (assigneesByCard.get(command.cardId) ?? []).map(
      (assignee) => assignee.userId,
    );

    const recipients = new Set([...assigneeIds, ...previousAuthorIds]);
    recipients.delete(command.currentUserId);

    if (recipients.size === 0) {
      return;
    }

    const board = await this.boards.findById(boardId);
    const actor = await this.userDirectory.findUserById(command.currentUserId);

    await this.notifications.publish(
      [...recipients].map((userId) => ({
        userId,
        type: 'card_commented' as const,
        actorId: command.currentUserId,
        actorName: actor?.name ?? 'Alguien',
        boardId,
        boardName: board?.name ?? '',
        cardId: command.cardId,
        cardTitle,
      })),
    );
  }
}
