import { randomUUID } from 'crypto';
import { Entity } from 'src/shared/domain/entity.base';

export interface CommentProps {
  id: string;
  body: string;
  cardId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Comment extends Entity<string> {
  private constructor(private readonly props: CommentProps) {
    super(props.id);
  }

  static create(props: {
    body: string;
    cardId: string;
    authorId: string;
  }): Comment {
    const now = new Date();
    return new Comment({
      id: randomUUID(),
      body: props.body,
      cardId: props.cardId,
      authorId: props.authorId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: CommentProps): Comment {
    return new Comment(props);
  }

  update(props: { body?: string }): Comment {
    return new Comment({
      ...this.props,
      body: props.body !== undefined ? props.body : this.props.body,
      updatedAt: new Date(),
    });
  }

  get body(): string {
    return this.props.body;
  }

  get cardId(): string {
    return this.props.cardId;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
