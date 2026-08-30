import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Invitation } from '../../domain/entities/invitation.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { INVITATION_REPOSITORY } from '../../domain/ports/invitation.repository';
import type { InvitationRepository } from '../../domain/ports/invitation.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';

export interface ListBoardInvitationsQuery {
  boardId: string;
  userId: string;
}

@Injectable()
export class ListBoardInvitationsUseCase implements UseCase<
  ListBoardInvitationsQuery,
  Invitation[]
> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(INVITATION_REPOSITORY)
    private readonly invitations: InvitationRepository,
  ) {}

  async execute(query: ListBoardInvitationsQuery): Promise<Invitation[]> {
    const board = await this.boards.findById(query.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    const isMember = await this.boards.isMember(query.boardId, query.userId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return await this.invitations.findPendingByBoard(query.boardId);
  }
}
