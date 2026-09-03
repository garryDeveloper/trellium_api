import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { IamModule } from '../iam/iam.module';
import { ListModule } from '../lists/list.module';
import { BoardsModule } from '../boards/boards.module';
import { CreateCardUseCase } from './application/use-cases/create-card.use-case';
import { UpdateCardUseCase } from './application/use-cases/update-card.use-case';
import { MoveCardUseCase } from './application/use-cases/move-card.use-case';
import { AssignMemberUseCase } from './application/use-cases/assign-member.use-case';
import { UnassignMemberUseCase } from './application/use-cases/unassign-member.use-case';
import { ListCardAssigneesUseCase } from './application/use-cases/list-card-assignees.use-case';
import { ApplyLabelUseCase } from './application/use-cases/apply-label.use-case';
import { RemoveLabelUseCase } from './application/use-cases/remove-label.use-case';
import { ListCardLabelsUseCase } from './application/use-cases/list-card-labels.use-case';
import { ArchiveCardUseCase } from './application/use-cases/archive-card.use-case';
import { UnarchiveCardUseCase } from './application/use-cases/unarchive-card.use-case';
import { DeleteCardUseCase } from './application/use-cases/delete-card.use-case';
import { ListCardsUseCase } from './application/use-cases/list-cards.use-case';
import { CreateChecklistUseCase } from './application/use-cases/create-checklist.use-case';
import { AddChecklistItemUseCase } from './application/use-cases/add-checklist-item.use-case';
import { ListCardChecklistsUseCase } from './application/use-cases/list-card-checklists.use-case';
import { UpdateChecklistItemUseCase } from './application/use-cases/update-checklist-item.use-case';
import { DeleteChecklistItemUseCase } from './application/use-cases/delete-checklist-item.use-case';
import { DeleteChecklistUseCase } from './application/use-cases/delete-checklist.use-case';
import { ListCardsChecklistProgressUseCase } from './application/use-cases/list-cards-checklist-progress.use-case';
import { CARD_REPOSITORY } from './domain/ports/card.repository';
import { CHECKLIST_REPOSITORY } from './domain/ports/checklist.repository';
import { MikroOrmCardRepository } from './infraestructure/persist/mikro-orm/repositories/mikro-orm-card.repository';
import { MikroOrmChecklistRepository } from './infraestructure/persist/mikro-orm/repositories/mikro-orm-checklist.repository';
import { CardMikroEntity } from './infraestructure/persist/mikro-orm/entities/card.mikro-entity';
import { CardAssigneeMikroEntity } from './infraestructure/persist/mikro-orm/entities/card_assignees.mikro-entity';
import { CardLabelMikroEntity } from './infraestructure/persist/mikro-orm/entities/card_labels.mikro-entity';
import { ChecklistMikroEntity } from './infraestructure/persist/mikro-orm/entities/checklist.mikro-entity';
import { ChecklistItemMikroEntity } from './infraestructure/persist/mikro-orm/entities/checklist-item.mikro-entity';
import { CardsController } from './infraestructure/http/controllers/cards.controller';
import { ChecklistsController } from './infraestructure/http/controllers/checklists.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CardMikroEntity,
      CardAssigneeMikroEntity,
      CardLabelMikroEntity,
      ChecklistMikroEntity,
      ChecklistItemMikroEntity,
    ]),
    IamModule,
    ListModule,
    BoardsModule,
  ],
  controllers: [CardsController, ChecklistsController],
  providers: [
    CreateCardUseCase,
    UpdateCardUseCase,
    MoveCardUseCase,
    AssignMemberUseCase,
    UnassignMemberUseCase,
    ListCardAssigneesUseCase,
    ApplyLabelUseCase,
    RemoveLabelUseCase,
    ListCardLabelsUseCase,
    ArchiveCardUseCase,
    UnarchiveCardUseCase,
    DeleteCardUseCase,
    ListCardsUseCase,
    CreateChecklistUseCase,
    AddChecklistItemUseCase,
    ListCardChecklistsUseCase,
    UpdateChecklistItemUseCase,
    DeleteChecklistItemUseCase,
    DeleteChecklistUseCase,
    ListCardsChecklistProgressUseCase,
    { provide: CARD_REPOSITORY, useClass: MikroOrmCardRepository },
    { provide: CHECKLIST_REPOSITORY, useClass: MikroOrmChecklistRepository },
  ],
  exports: [CARD_REPOSITORY, CHECKLIST_REPOSITORY],
})
export class CardModule {}
