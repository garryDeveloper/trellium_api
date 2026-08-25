export interface BoardMemberProps {
  boardId: string;
  userId: string;
  joinedAt: Date;
}

export class BoardMember {
  private constructor(private readonly props: BoardMemberProps) {}

  static create(props: { boardId: string; userId: string }): BoardMember {
    return new BoardMember({
      boardId: props.boardId,
      userId: props.userId,
      joinedAt: new Date(),
    });
  }

  static fromPersistence(props: BoardMemberProps): BoardMember {
    return new BoardMember(props);
  }

  get boardId(): string {
    return this.props.boardId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get joinedAt(): Date {
    return this.props.joinedAt;
  }
}
