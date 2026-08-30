import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { INVITATION_REPOSITORY } from '../../domain/ports/invitation.repository';
import type { InvitationRepository } from '../../domain/ports/invitation.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';
import { InvitationNotPendingError } from '../../domain/errors/invitation-not-pending.error';

export interface CancelInvitationCommand {
  boardId: string;
  invitationId: string;
  userId: string;
}

@Injectable()
export class CancelInvitationUseCase implements UseCase<
  CancelInvitationCommand,
  void
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(INVITATION_REPOSITORY)
    private readonly invitations: InvitationRepository,
  ) {}

  async execute(command: CancelInvitationCommand): Promise<void> {
    const isMember = await this.boards.isMember(
      command.boardId,
      command.userId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const invitation = await this.invitations.findById(command.invitationId);
    if (!invitation || invitation.boardId !== command.boardId) {
      throw new Error('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new InvitationNotPendingError();
    }

    await this.invitations.delete(command.invitationId);
  }
}
