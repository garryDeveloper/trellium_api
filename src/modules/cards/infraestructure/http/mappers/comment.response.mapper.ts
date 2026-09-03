import { CommentWithAuthor } from '../../../domain/ports/comment.repository';
import { CommentResponseDto } from '../dto/comment.response.dto';

export class CommentResponseMapper {
  static toResponseDto({
    comment,
    author,
  }: CommentWithAuthor): CommentResponseDto {
    return {
      id: comment.id,
      body: comment.body,
      cardId: comment.cardId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
      },
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
