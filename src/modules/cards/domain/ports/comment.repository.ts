import { Comment } from '../entities/comment.entity';

export interface CommentAuthorInfo {
  id: string;
  name: string;
  email: string;
}

/**
 * Comentario junto con los datos públicos de su autor. El agregado `Comment`
 * solo guarda `authorId`; la capa HTTP necesita además nombre y email, y
 * resolverlos comentario por comentario costaría N+1 queries al listar.
 */
export interface CommentWithAuthor {
  comment: Comment;
  author: CommentAuthorInfo;
}

export interface CommentAuthorizationContext {
  comment: Comment;
  boardId: string;
  boardOwnerId: string;
  isCurrentUserMember: boolean;
}

export interface CommentRepository {
  createComment(comment: Comment): Promise<CommentWithAuthor>;
  findCommentsByCard(cardId: string): Promise<CommentWithAuthor[]>;
  updateComment(comment: Comment): Promise<CommentWithAuthor>;
  findCommentById(commentId: string): Promise<Comment | null>;
  /**
   * Resuelve autor + dueño del tablero + membresía en una sola query.
   * Recorrer comment -> tarjeta -> lista -> tablero y luego consultar la
   * membresía costaría cuatro round-trips; el join los colapsa en uno.
   */
  findAuthorizationContext(
    commentId: string,
    userId: string,
  ): Promise<CommentAuthorizationContext | null>;
  deleteComment(commentId: string): Promise<void>;
}

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');
