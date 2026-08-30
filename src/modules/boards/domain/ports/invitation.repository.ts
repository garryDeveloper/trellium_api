import { Invitation } from '../entities/invitation.entity';

export interface InvitationSummary {
  invitation: Invitation;
  boardName: string;
  invitedBy: { id: string; name: string; email: string };
}

export interface InvitationRepository {
  findPendingByBoardAndEmail(
    boardId: string,
    email: string,
  ): Promise<Invitation | null>;
  findById(invitationId: string): Promise<Invitation | null>;
  findPendingByEmail(email: string): Promise<InvitationSummary[]>;
  findPendingByBoard(boardId: string): Promise<Invitation[]>;
  create(invitation: Invitation): Promise<Invitation>;
  update(invitation: Invitation): Promise<Invitation>;
  delete(invitationId: string): Promise<void>;
}

export const INVITATION_REPOSITORY = Symbol('INVITATION_REPOSITORY');
