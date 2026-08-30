import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { INVITATION_REPOSITORY } from '../../domain/ports/invitation.repository';
import type {
  InvitationRepository,
  InvitationSummary,
} from '../../domain/ports/invitation.repository';

export interface ListMyInvitationsQuery {
  userEmail: string;
}

@Injectable()
export class ListMyInvitationsUseCase implements UseCase<
  ListMyInvitationsQuery,
  InvitationSummary[]
> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitations: InvitationRepository,
  ) {}

  async execute(query: ListMyInvitationsQuery): Promise<InvitationSummary[]> {
    return await this.invitations.findPendingByEmail(query.userEmail);
  }
}
