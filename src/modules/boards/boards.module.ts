import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { IamModule } from '../iam/iam.module';
import { CreateBoardUseCase } from './application/use-cases/create-board.use-case';
import { ListMyBoardsUseCase } from './application/use-cases/list-my-boards.use-case';
import { BOARD_REPOSITORY } from './domain/ports/board.repository';
import { MikroOrmBoardRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-board.repository';
import { BoardMikroEntity } from './infrastructure/persistence/mikro-orm/entities/board.mikro-entity';
import { BoardMemberMikroEntity } from './infrastructure/persistence/mikro-orm/entities/board-member.mikro-entity';
import { InvitationMikroEntity } from './infrastructure/persistence/mikro-orm/entities/invitation.mikro-entity';
import { BoardsController } from './infrastructure/http/controllers/boards.controller';
import { BoardInvitationsController } from './infrastructure/http/controllers/board-invitations.controller';
import { InvitationsController } from './infrastructure/http/controllers/invitations.controller';
import { MeInvitationsController } from './infrastructure/http/controllers/me-invitations.controller';
import { BoardMembersController } from './infrastructure/http/controllers/board-members.controller';
import { ChangeStatusUseCase } from './application/use-cases/change-status.use-case';
import { ChangeNameUseCase } from './application/use-cases/change-name.use-case';
import { DeleteBoardUseCase } from './application/use-cases/delete-board.use-case';
import { TransferOwnershipUseCase } from './application/use-cases/transfer-ownership.use-case';
import { InviteMemberUseCase } from './application/use-cases/invite-member.use-case';
import { AcceptInvitationUseCase } from './application/use-cases/accept-invitation.use-case';
import { RejectInvitationUseCase } from './application/use-cases/reject-invitation.use-case';
import { ListMyInvitationsUseCase } from './application/use-cases/list-my-invitations.use-case';
import { ListBoardMembersUseCase } from './application/use-cases/list-board-members.use-case';
import { RemoveMemberUseCase } from './application/use-cases/remove-member.use-case';
import { ListBoardInvitationsUseCase } from './application/use-cases/list-board-invitations.use-case';
import { CancelInvitationUseCase } from './application/use-cases/cancel-invitation.use-case';
import { INVITATION_REPOSITORY } from './domain/ports/invitation.repository';
import { MikroOrmInvitationRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-invitation.repository';
import { USER_DIRECTORY_PORT } from './application/ports/user-directory.port';
import { IamUserDirectoryAdapter } from './infrastructure/adapters/iam-user-directory.adapter';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      BoardMikroEntity,
      BoardMemberMikroEntity,
      InvitationMikroEntity,
    ]),
    IamModule,
  ],
  controllers: [
    BoardsController,
    BoardInvitationsController,
    InvitationsController,
    MeInvitationsController,
    BoardMembersController,
  ],
  providers: [
    CreateBoardUseCase,
    ListMyBoardsUseCase,
    ChangeStatusUseCase,
    ChangeNameUseCase,
    DeleteBoardUseCase,
    TransferOwnershipUseCase,
    InviteMemberUseCase,
    AcceptInvitationUseCase,
    RejectInvitationUseCase,
    ListMyInvitationsUseCase,
    ListBoardMembersUseCase,
    RemoveMemberUseCase,
    ListBoardInvitationsUseCase,
    CancelInvitationUseCase,
    { provide: BOARD_REPOSITORY, useClass: MikroOrmBoardRepository },
    { provide: INVITATION_REPOSITORY, useClass: MikroOrmInvitationRepository },
    { provide: USER_DIRECTORY_PORT, useClass: IamUserDirectoryAdapter },
  ],
  exports: [BOARD_REPOSITORY],
})
export class BoardsModule {}
