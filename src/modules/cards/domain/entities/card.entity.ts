import { randomUUID } from 'crypto';
import { Entity } from 'src/shared/domain/entity.base';

export interface CardProps {
  id: string;
  title: string;
  description: string | null;
  listId: string;
  status: 'active' | 'archived';
  position: number;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export class Card extends Entity<string> {
  private constructor(private readonly props: CardProps) {
    super(props.id);
  }

  static create(props: {
    title: string;
    listId: string;
    position: number;
  }): Card {
    const now = new Date();
    return new Card({
      id: randomUUID(),
      title: props.title,
      description: null,
      listId: props.listId,
      status: 'active',
      position: props.position,
      dueDate: null,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    });
  }

  static fromPersistence(props: CardProps): Card {
    return new Card(props);
  }

  update(props: {
    title?: string;
    description?: string | null;
    dueDate?: Date | null;
  }): Card {
    return new Card({
      ...this.props,
      title: props.title !== undefined ? props.title : this.props.title,
      description:
        props.description !== undefined
          ? props.description
          : this.props.description,
      dueDate: props.dueDate !== undefined ? props.dueDate : this.props.dueDate,
      updatedAt: new Date(),
    });
  }

  moveTo(props: { listId: string; position: number }): Card {
    return new Card({
      ...this.props,
      listId: props.listId,
      position: props.position,
      updatedAt: new Date(),
    });
  }

  archive(): Card {
    const now = new Date();
    return new Card({
      ...this.props,
      status: 'archived',
      archivedAt: now,
      updatedAt: now,
    });
  }

  unarchive(): Card {
    return new Card({
      ...this.props,
      status: 'active',
      archivedAt: null,
      updatedAt: new Date(),
    });
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get listId(): string {
    return this.props.listId;
  }

  get status(): 'active' | 'archived' {
    return this.props.status;
  }

  get position(): number {
    return this.props.position;
  }

  get dueDate(): Date | null {
    return this.props.dueDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get archivedAt(): Date | null {
    return this.props.archivedAt;
  }
}
