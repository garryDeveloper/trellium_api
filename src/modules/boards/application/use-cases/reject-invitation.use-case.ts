import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Invitation } from '../../domain/entities/invitation.entity';
import { INVITATION_REPOSITORY } from '../../domain/ports/invitation.repository';
import type { InvitationRepository } from '../../domain/ports/invitation.repository';
import { NotInvitationRecipientError } from '../../domain/errors/not-invitation-recipient.error';
import { InvitationNotPendingError } from '../../domain/errors/invitation-not-pending.error';

export interface RejectInvitationCommand {
  invitationId: string;
  userEmail: string;
}

@Injectable()
export class RejectInvitationUseCase implements UseCase<
  RejectInvitationCommand,
  Invitation
> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitations: InvitationRepository,
  ) {}

  async execute(command: RejectInvitationCommand): Promise<Invitation> {
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

    return await this.invitations.update(invitation.reject());
  }
}
