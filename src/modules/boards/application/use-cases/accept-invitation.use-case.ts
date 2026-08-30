import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Board } from '../../domain/entities/board.entity';
import { BoardMember } from '../../domain/entities/board-member.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { INVITATION_REPOSITORY } from '../../domain/ports/invitation.repository';
import type { InvitationRepository } from '../../domain/ports/invitation.repository';
import { NotInvitationRecipientError } from '../../domain/errors/not-invitation-recipient.error';
import { InvitationNotPendingError } from '../../domain/errors/invitation-not-pending.error';

export interface AcceptInvitationCommand {
  invitationId: string;
  userId: string;
  userEmail: string;
}

@Injectable()
export class AcceptInvitationUseCase implements UseCase<
  AcceptInvitationCommand,
  Board
> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitations: InvitationRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: AcceptInvitationCommand): Promise<Board> {
    const invitation = await this.invitations.findById(command.invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.invitedEmail !== command.userEmail) {
      throw new NotInvitationRecipientError();
    }

    if (invitation.status !== 'pending') {
      throw new InvitationNotPendingError();
    }

    await this.invitations.update(invitation.accept());

    await this.boards.addMember(
      BoardMember.create({
        boardId: invitation.boardId,
        userId: command.userId,
      }),
    );

    const board = await this.boards.findById(invitation.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    return board;
  }
}
