import { randomUUID } from 'crypto';
import { Entity } from 'src/shared/domain/entity.base';

export interface ChecklistProps {
  id: string;
  name: string;
  cardId: string;
  createdAt: Date;
}

export class Checklist extends Entity<string> {
  private constructor(private readonly props: ChecklistProps) {
    super(props.id);
  }

  static create(props: { name: string; cardId: string }): Checklist {
    return new Checklist({
      id: randomUUID(),
      name: props.name,
      cardId: props.cardId,
      createdAt: new Date(),
    });
  }

  static fromPersistence(props: ChecklistProps): Checklist {
    return new Checklist(props);
  }

  get name(): string {
    return this.props.name;
  }

  get cardId(): string {
    return this.props.cardId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
