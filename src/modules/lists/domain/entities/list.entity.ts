import { randomUUID } from 'crypto';
import { Entity } from 'src/shared/domain/entity.base';

export interface ListProps {
  id: string;
  name: string;
  boardId: string;
  status: 'active' | 'archived';
  position: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export class List extends Entity<string> {
  private constructor(private readonly props: ListProps) {
    super(props.id);
  }

  static create(props: {
    name: string;
    boardId: string;
    position: number;
  }): List {
    const now = new Date();
    return new List({
      id: randomUUID(),
      name: props.name,
      boardId: props.boardId,
      status: 'active',
      position: props.position,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    });
  }

  static fromPersistence(props: ListProps): List {
    return new List(props);
  }

  rename(name: string): List {
    return new List({ ...this.props, name, updatedAt: new Date() });
  }

  reorder(position: number): List {
    return new List({ ...this.props, position, updatedAt: new Date() });
  }

  archive(): List {
    const now = new Date();
    return new List({
      ...this.props,
      status: 'archived',
      archivedAt: now,
      updatedAt: now,
    });
  }

  unarchive(): List {
    return new List({
      ...this.props,
      status: 'active',
      archivedAt: null,
      updatedAt: new Date(),
    });
  }

  get name(): string {
    return this.props.name;
  }

  get boardId(): string {
    return this.props.boardId;
  }

  get status(): 'active' | 'archived' {
    return this.props.status;
  }

  get position(): number {
    return this.props.position;
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
