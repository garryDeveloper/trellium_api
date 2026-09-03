import { Comment } from 'src/modules/cards/domain/entities/comment.entity';
import { CommentWithAuthor } from 'src/modules/cards/domain/ports/comment.repository';
import { CommentMikroEntity } from '../entities/comment.mikro-entity';

export class CommentMapper {
  static toDomain(entity: CommentMikroEntity): Comment {
    return Comment.fromPersistence({
      id: entity.id,
      body: entity.body,
      cardId: entity.card.id,
      authorId: entity.author.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /** Requiere que la relación `author` venga poblada. */
  static toDomainWithAuthor(entity: CommentMikroEntity): CommentWithAuthor {
    return {
      comment: this.toDomain(entity),
      author: {
        id: entity.author.id,
        name: entity.author.name,
        email: entity.author.email,
      },
    };
  }

  static toPersistence(comment: Comment) {
    return {
      id: comment.id,
      body: comment.body,
      card: comment.cardId,
      author: comment.authorId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
