import { Invitation } from '../../../../domain/entities/invitation.entity';
import { InvitationMikroEntity } from '../entities/invitation.mikro-entity';

export class InvitationMapper {
  static toDomain(entity: InvitationMikroEntity): Invitation {
    return Invitation.fromPersistence({
      id: entity.id,
      boardId: entity.board.id,
      invitedEmail: entity.invitedEmail,
      invitedByUserId: entity.invitedBy.id,
      status: entity.status,
      createdAt: entity.createdAt,
      resolvedAt: entity.resolvedAt ?? null,
    });
  }

  static toPersistence(invitation: Invitation) {
    return {
      id: invitation.id,
      board: invitation.boardId,
      invitedEmail: invitation.invitedEmail,
      invitedBy: invitation.invitedByUserId,
      status: invitation.status,
      createdAt: invitation.createdAt,
      resolvedAt: invitation.resolvedAt,
    };
  }
}
