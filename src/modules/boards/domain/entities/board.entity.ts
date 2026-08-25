import { randomUUID } from 'crypto';
import { Entity } from '../../../../shared/domain/entity.base';

export interface BoardProps {
  id: string;
  name: string;
  ownerId: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export class Board extends Entity<string> {
  private constructor(private readonly props: BoardProps) {
    super(props.id);
  }

  static create(props: { name: string; ownerId: string }): Board {
    const now = new Date();
    return new Board({
      id: randomUUID(),
      name: props.name,
      ownerId: props.ownerId,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: BoardProps): Board {
    return new Board(props);
  }

  rename(name: string): Board {
    return new Board({ ...this.props, name, updatedAt: new Date() });
  }

  get name(): string {
    return this.props.name;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get status(): 'active' | 'archived' {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
