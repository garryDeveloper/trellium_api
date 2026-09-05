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
import { LabelMikroEntity } from './infrastructure/persistence/mikro-orm/entities/label.mikro-entity';
import { BoardViewPreferencesMikroEntity } from './infrastructure/persistence/mikro-orm/entities/board-view-preferences.mikro-entity';
import { BoardsController } from './infrastructure/http/controllers/boards.controller';
import { BoardInvitationsController } from './infrastructure/http/controllers/board-invitations.controller';
import { InvitationsController } from './infrastructure/http/controllers/invitations.controller';
import { MeInvitationsController } from './infrastructure/http/controllers/me-invitations.controller';
import { BoardMembersController } from './infrastructure/http/controllers/board-members.controller';
import { BoardLabelsController } from './infrastructure/http/controllers/board-labels.controller';
import { LabelsController } from './infrastructure/http/controllers/labels.controller';
import { BoardViewPreferencesController } from './infrastructure/http/controllers/board-view-preferences.controller';
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
import { NotificationsModule } from '../notifications/notifications.module';
import { IamUserDirectoryAdapter } from './infrastructure/adapters/iam-user-directory.adapter';
import { LABEL_REPOSITORY } from './domain/ports/label.repository';
import { MikroOrmLabelRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-label.repository';
import { CreateLabelUseCase } from './application/use-cases/create-label.use-case';
import { ListBoardLabelsUseCase } from './application/use-cases/list-board-labels.use-case';
import { UpdateLabelUseCase } from './application/use-cases/update-label.use-case';
import { DeleteLabelUseCase } from './application/use-cases/delete-label.use-case';
import { BOARD_VIEW_PREFERENCES_REPOSITORY } from './domain/ports/board-view-preferences.repository';
import { MikroOrmBoardViewPreferencesRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-board-view-preferences.repository';
import { GetBoardViewPreferencesUseCase } from './application/use-cases/get-board-view-preferences.use-case';
import { SaveBoardViewPreferencesUseCase } from './application/use-cases/save-board-view-preferences.use-case';

@Module({
  imports: [
    NotificationsModule,
    MikroOrmModule.forFeature([
      BoardMikroEntity,
      BoardMemberMikroEntity,
      InvitationMikroEntity,
      LabelMikroEntity,
      BoardViewPreferencesMikroEntity,
    ]),
    IamModule,
  ],
  controllers: [
    BoardsController,
    BoardInvitationsController,
    InvitationsController,
    MeInvitationsController,
    BoardMembersController,
    BoardLabelsController,
    LabelsController,
    BoardViewPreferencesController,
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
    CreateLabelUseCase,
    ListBoardLabelsUseCase,
    UpdateLabelUseCase,
    DeleteLabelUseCase,
    GetBoardViewPreferencesUseCase,
    SaveBoardViewPreferencesUseCase,
    { provide: BOARD_REPOSITORY, useClass: MikroOrmBoardRepository },
    { provide: INVITATION_REPOSITORY, useClass: MikroOrmInvitationRepository },
    { provide: USER_DIRECTORY_PORT, useClass: IamUserDirectoryAdapter },
    { provide: LABEL_REPOSITORY, useClass: MikroOrmLabelRepository },
    {
      provide: BOARD_VIEW_PREFERENCES_REPOSITORY,
      useClass: MikroOrmBoardViewPreferencesRepository,
    },
  ],
  exports: [BOARD_REPOSITORY, LABEL_REPOSITORY],
})
export class BoardsModule {}
