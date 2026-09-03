import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import {
  CommentAuthorizationContext,
  CommentRepository,
  CommentWithAuthor,
} from 'src/modules/cards/domain/ports/comment.repository';
import { Comment } from 'src/modules/cards/domain/entities/comment.entity';
import { CommentMikroEntity } from '../entities/comment.mikro-entity';
import { CommentMapper } from '../mappers/comment.mapper';
import { CommentNotFoundError } from 'src/modules/cards/domain/errors/comment-not-found.error';

@Injectable()
export class MikroOrmCommentRepository implements CommentRepository {
  constructor(private readonly em: EntityManager) {}
  async deleteComment(commentId: string): Promise<void> {
    await this.em.nativeDelete(CommentMikroEntity, { id: commentId });
  }
  async findCommentById(commentId: string): Promise<Comment | null> {
    const comment = await this.em.findOne(CommentMikroEntity, {
      id: commentId,
    });
    return comment ? CommentMapper.toDomain(comment) : null;
  }

  // Autorizar recorriendo comentario -> tarjeta -> lista -> tablero y luego
  // consultando `board_members` costaría cuatro round-trips por request; el
  // join los colapsa en uno. El `left join` sobre `board_members` va
  // parametrizado por el usuario actual para resolver también la membresía.
  async findAuthorizationContext(
    commentId: string,
    userId: string,
  ): Promise<CommentAuthorizationContext | null> {
    const [row] = await this.em.getConnection().execute<
      {
        id: string;
        body: string;
        cardId: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        boardOwnerId: string;
        isMember: boolean;
      }[]
    >(
      `select c.id, c.body,
                    c.card_id    as "cardId",
                    c.author_id  as "authorId",
                    c.created_at as "createdAt",
                    c.updated_at as "updatedAt",
                    b.id         as "boardId",
                    b.owner_id   as "boardOwnerId",
                    (bm.user_id is not null) as "isMember"
               from comments c
               join cards ca on ca.id = c.card_id
               join lists l  on l.id  = ca.list_id
               join boards b on b.id  = l.board_id
               left join board_members bm
                      on bm.board_id = b.id and bm.user_id = ?
              where c.id = ?`,
      [userId, commentId],
    );

    if (!row) {
      return null;
    }

    return {
      comment: Comment.fromPersistence({
        id: row.id,
        body: row.body,
        cardId: row.cardId,
        authorId: row.authorId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
      boardId: row.boardId,
      boardOwnerId: row.boardOwnerId,
      isCurrentUserMember: row.isMember,
    };
  }

  async createComment(comment: Comment): Promise<CommentWithAuthor> {
    const commentEntity = this.em.create(
      CommentMikroEntity,
      CommentMapper.toPersistence(comment),
    );
    await this.em.persist(commentEntity).flush();
    // `author` se creó como referencia a partir del id: hay que cargarla para
    // poder devolver nombre y email.
    await this.em.populate(commentEntity, ['author']);
    return CommentMapper.toDomainWithAuthor(commentEntity);
  }

  async findCommentsByCard(cardId: string): Promise<CommentWithAuthor[]> {
    const comments = await this.em.find(
      CommentMikroEntity,
      { card: cardId },
      { populate: ['author'], orderBy: { createdAt: 'asc' } },
    );
    return comments.map((entity) => CommentMapper.toDomainWithAuthor(entity));
  }

  async updateComment(comment: Comment): Promise<CommentWithAuthor> {
    const commentEntity = await this.em.findOne(
      CommentMikroEntity,
      { id: comment.id },
      { populate: ['author'] },
    );
    if (!commentEntity) {
      throw new CommentNotFoundError();
    }
    this.em.assign(commentEntity, CommentMapper.toPersistence(comment));
    await this.em.flush();
    return CommentMapper.toDomainWithAuthor(commentEntity);
  }
}
