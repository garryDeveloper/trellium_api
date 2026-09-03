import { Inject, Injectable } from '@nestjs/common';
import { Comment } from '../../domain/entities/comment.entity';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  COMMENT_REPOSITORY,
  type CommentRepository,
} from '../../domain/ports/comment.repository';
import { CommentNotFoundError } from '../../domain/errors/comment-not-found.error';
import { UserNotAuthorizedDeleteCommentError } from '../../domain/errors/not-authorized-delete-comment.error';

interface RemoveCommentCommand {
  commentId: string;
  currentUserId: string;
}

@Injectable()
export class RemoveCommentUseCase implements UseCase<
  RemoveCommentCommand,
  Comment
> {
  constructor(
    @Inject(COMMENT_REPOSITORY) private readonly comments: CommentRepository,
  ) {}

  async execute(command: RemoveCommentCommand): Promise<Comment> {
    // Una sola query trae el comentario junto con el dueño del tablero y la
    // membresía del usuario actual.
    const context = await this.comments.findAuthorizationContext(
      command.commentId,
      command.currentUserId,
    );
    if (!context) {
      throw new CommentNotFoundError();
    }

    const isBoardOwner = context.boardOwnerId === command.currentUserId;
    const isAuthor = context.comment.authorId === command.currentUserId;

    // El dueño puede moderar comentarios ajenos; el autor solo puede eliminar
    // el suyo mientras siga siendo miembro del tablero.
    if (!isBoardOwner && !(isAuthor && context.isCurrentUserMember)) {
      throw new UserNotAuthorizedDeleteCommentError();
    }

    await this.comments.deleteComment(command.commentId);
    return context.comment;
  }
}
