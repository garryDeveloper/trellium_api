import { Board } from '../../../domain/entities/board.entity';
import { Invitation } from '../../../domain/entities/invitation.entity';
import { Label } from '../../../domain/entities/label.entity';
import { BoardMembershipSummary } from '../../../domain/ports/board.repository';
import { InvitationSummary } from '../../../domain/ports/invitation.repository';
import { BoardMemberSummary } from '../../../application/use-cases/list-board-members.use-case';
import { BoardResponseDto } from '../dto/board.response.dto';
import { BoardListItemResponseDto } from '../dto/board-list-item.response.dto';
import { InvitationResponseDto } from '../dto/invitation.response.dto';
import { MyInvitationResponseDto } from '../dto/my-invitation.response.dto';
import { BoardMemberResponseDto } from '../dto/board-member.response.dto';
import { LabelResponseDto } from '../dto/label.response.dto';

export class BoardResponseMapper {
  static toLabelDto(label: Label): LabelResponseDto {
    return {
      id: label.id,
      boardId: label.boardId,
      name: label.name,
      color: label.color,
    };
  }

  static toInvitationDto(invitation: Invitation): InvitationResponseDto {
    return {
      id: invitation.id,
      boardId: invitation.boardId,
      invitedEmail: invitation.invitedEmail,
      invitedByUserId: invitation.invitedByUserId,
      status: invitation.status,
      createdAt: invitation.createdAt.toISOString(),
    };
  }

  static toMyInvitationDto(
    summary: InvitationSummary,
  ): MyInvitationResponseDto {
    return {
      id: summary.invitation.id,
      boardId: summary.invitation.boardId,
      boardName: summary.boardName,
      invitedEmail: summary.invitation.invitedEmail,
      status: summary.invitation.status,
      invitedBy: summary.invitedBy,
      createdAt: summary.invitation.createdAt.toISOString(),
    };
  }

  static toResponseDto(board: Board): BoardResponseDto {
    return {
      id: board.id,
      name: board.name,
      ownerId: board.ownerId,
      status: board.status,
      createdAt: board.createdAt.toISOString(),
    };
  }

  static toListItemDto(
    summary: BoardMembershipSummary,
  ): BoardListItemResponseDto {
    return {
      id: summary.id,
      name: summary.name,
      ownerId: summary.ownerId,
      status: summary.status,
      createdAt: summary.createdAt.toISOString(),
      role: summary.role,
      memberCount: summary.memberCount,
    };
  }

  static toMemberDto(member: BoardMemberSummary): BoardMemberResponseDto {
    return {
      userId: member.userId,
      name: member.name,
      email: member.email,
      role: member.role,
    };
  }
}
