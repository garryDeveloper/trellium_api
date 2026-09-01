export interface CardLabelProps {
  cardId: string;
  labelId: string;
}

export class CardLabel {
  private constructor(private readonly props: CardLabelProps) {}

  static create(props: { cardId: string; labelId: string }): CardLabel {
    return new CardLabel({
      cardId: props.cardId,
      labelId: props.labelId,
    });
  }

  static fromPersistence(props: CardLabelProps): CardLabel {
    return new CardLabel(props);
  }

  get cardId(): string {
    return this.props.cardId;
  }

  get labelId(): string {
    return this.props.labelId;
  }
}
