import { randomUUID } from 'crypto';
import { Entity } from '../../../../shared/domain/entity.base';

export interface InvitationProps {
  id: string;
  boardId: string;
  invitedEmail: string;
  invitedByUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  resolvedAt: Date | null;
}

export class Invitation extends Entity<string> {
  private constructor(private readonly props: InvitationProps) {
    super(props.id);
  }

  static create(props: {
    boardId: string;
    invitedEmail: string;
    invitedByUserId: string;
  }): Invitation {
    return new Invitation({
      id: randomUUID(),
      boardId: props.boardId,
      invitedEmail: props.invitedEmail,
      invitedByUserId: props.invitedByUserId,
      status: 'pending',
      createdAt: new Date(),
      resolvedAt: null,
    });
  }

  static fromPersistence(props: InvitationProps): Invitation {
    return new Invitation(props);
  }

  accept(): Invitation {
    return new Invitation({
      ...this.props,
      status: 'accepted',
      resolvedAt: new Date(),
    });
  }

  reject(): Invitation {
    return new Invitation({
      ...this.props,
      status: 'rejected',
      resolvedAt: new Date(),
    });
  }

  get boardId(): string {
    return this.props.boardId;
  }

  get invitedEmail(): string {
    return this.props.invitedEmail;
  }

  get invitedByUserId(): string {
    return this.props.invitedByUserId;
  }

  get status(): 'pending' | 'accepted' | 'rejected' {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get resolvedAt(): Date | null {
    return this.props.resolvedAt;
  }
}
