import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Invitation } from '../../domain/entities/invitation.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { INVITATION_REPOSITORY } from '../../domain/ports/invitation.repository';
import type { InvitationRepository } from '../../domain/ports/invitation.repository';
import { USER_DIRECTORY_PORT } from '../ports/user-directory.port';
import type { UserDirectoryPort } from '../ports/user-directory.port';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';
import { AlreadyBoardMemberError } from '../../domain/errors/already-board-member.error';
import { InvitationAlreadyPendingError } from '../../domain/errors/invitation-already-pending.error';
import {
  NOTIFICATION_PUBLISHER,
  type NotificationPublisherPort,
} from 'src/shared/application/ports/notification-publisher.port';

export interface InviteMemberCommand {
  boardId: string;
  email: string;
  invitedByUserId: string;
}

@Injectable()
export class InviteMemberUseCase implements UseCase<
  InviteMemberCommand,
  Invitation
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(INVITATION_REPOSITORY)
    private readonly invitations: InvitationRepository,
    @Inject(USER_DIRECTORY_PORT)
    private readonly userDirectory: UserDirectoryPort,
    @Inject(NOTIFICATION_PUBLISHER)
    private readonly notifications: NotificationPublisherPort,
  ) {}

  async execute(command: InviteMemberCommand): Promise<Invitation> {
    const board = await this.boards.findById(command.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    const isMember = await this.boards.isMember(
      command.boardId,
      command.invitedByUserId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const invitedUserId = await this.userDirectory.findUserIdByEmail(
      command.email,
    );
    if (invitedUserId) {
      const invitedIsMember = await this.boards.isMember(
        command.boardId,
        invitedUserId,
      );
      if (invitedIsMember) {
        throw new AlreadyBoardMemberError();
      }
    }

    const pending = await this.invitations.findPendingByBoardAndEmail(
      command.boardId,
      command.email,
    );
    if (pending) {
      throw new InvitationAlreadyPendingError();
    }

    const invitation = Invitation.create({
      boardId: command.boardId,
      invitedEmail: command.email,
      invitedByUserId: command.invitedByUserId,
    });

    const created = await this.invitations.create(invitation);

    // Se invita por email y el invitado puede no tener cuenta todavía: sin
    // usuario no hay a quién notificar, y esa persona va a ver la invitación
    // en `/me/invitations` cuando se registre. `invitedUserId` ya se resolvió
    // arriba, así que no hay query extra.
    if (invitedUserId) {
      const actor = await this.userDirectory.findUserNameById(
        command.invitedByUserId,
      );

      await this.notifications.publish([
        {
          userId: invitedUserId,
          type: 'board_invited',
          actorId: command.invitedByUserId,
          actorName: actor ?? 'Alguien',
          boardId: board.id,
          boardName: board.name,
        },
      ]);
    }

    return created;
  }
}
