import { randomUUID } from "crypto";
import { Entity } from "src/shared/domain/entity.base";

export interface ListProps {
  id: string;
  name: string;
  boardId: string;
  status: 'active' | 'archived';
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export class List extends Entity<string> {
  private constructor(private readonly props: ListProps) {
    super(props.id);
  }

  static create(props: { name: string; boardId: string, position: number }): List {
      const now = new Date();
      return new List({
        id: randomUUID(),
        name: props.name,
        boardId: props.boardId,
        status: 'active',
        position: props.position,
        createdAt: now,
        updatedAt: now,
      });
    }

  static fromPersistence(props: ListProps): List {
    return new List(props);
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
}