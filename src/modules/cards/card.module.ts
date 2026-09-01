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
import { ArchiveCardUseCase } from './application/use-cases/archive-card.use-case';
import { UnarchiveCardUseCase } from './application/use-cases/unarchive-card.use-case';
import { DeleteCardUseCase } from './application/use-cases/delete-card.use-case';
import { ListCardsUseCase } from './application/use-cases/list-cards.use-case';
import { CARD_REPOSITORY } from './domain/ports/card.repository';
import { MikroOrmCardRepository } from './infraestructure/persist/mikro-orm/repositories/mikro-orm-card.repository';
import { CardMikroEntity } from './infraestructure/persist/mikro-orm/entities/card.mikro-entity';
import { CardAssigneeMikroEntity } from './infraestructure/persist/mikro-orm/entities/card_assignees.mikro-entity';
import { CardsController } from './infraestructure/http/controllers/cards.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([CardMikroEntity, CardAssigneeMikroEntity]),
    IamModule,
    ListModule,
    BoardsModule,
  ],
  controllers: [CardsController],
  providers: [
    CreateCardUseCase,
    UpdateCardUseCase,
    MoveCardUseCase,
    AssignMemberUseCase,
    UnassignMemberUseCase,
    ListCardAssigneesUseCase,
    ArchiveCardUseCase,
    UnarchiveCardUseCase,
    DeleteCardUseCase,
    ListCardsUseCase,
    { provide: CARD_REPOSITORY, useClass: MikroOrmCardRepository },
  ],
  exports: [CARD_REPOSITORY],
})
export class CardModule {}
