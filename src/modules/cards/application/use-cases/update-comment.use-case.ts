import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { CommentNotFoundError } from '../../domain/errors/comment-not-found.error';
import { UserNotAuthorMemberError } from '../../domain/errors/user-not-author.error';
import {
  COMMENT_REPOSITORY,
  type CommentRepository,
  type CommentWithAuthor,
} from '../../domain/ports/comment.repository';

interface UpdateCommentCommand {
  commentId: string;
  body?: string;
  currentUserId: string;
}

@Injectable()
export class UpdateCommentUseCase implements UseCase<
  UpdateCommentCommand,
  CommentWithAuthor
> {
  constructor(
    @Inject(COMMENT_REPOSITORY) private readonly comments: CommentRepository,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<CommentWithAuthor> {
    const comment = await this.comments.findCommentById(command.commentId);
    if (!comment) {
      throw new CommentNotFoundError();
    }

    if (comment.authorId !== command.currentUserId) {
      throw new UserNotAuthorMemberError();
    }

    const updated = comment.update({
      body: command.body,
    });

    return this.comments.updateComment(updated);
  }
}
