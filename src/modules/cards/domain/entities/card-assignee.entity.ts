export interface CardAssigneeProps {
  cardId: string;
  userId: string;
  assignedAt: Date;
}

export class CardAssignee {
  private constructor(private readonly props: CardAssigneeProps) {}

  static create(props: { cardId: string; userId: string }): CardAssignee {
    return new CardAssignee({
      cardId: props.cardId,
      userId: props.userId,
      assignedAt: new Date(),
    });
  }

  static fromPersistence(props: CardAssigneeProps): CardAssignee {
    return new CardAssignee(props);
  }

  get cardId(): string {
    return this.props.cardId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get assignedAt(): Date {
    return this.props.assignedAt;
  }
}
