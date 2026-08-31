import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { IamModule } from '../iam/iam.module';
import { BoardsModule } from '../boards/boards.module';
import { CreateListUseCase } from './application/use-cases/create-list.use-case';
import { RenameListUseCase } from './application/use-cases/rename-list.use-case';
import { ReorderListUseCase } from './application/use-cases/reorder-list.use-case';
import { ArchiveListUseCase } from './application/use-cases/archive-list.use-case';
import { UnarchiveListUseCase } from './application/use-cases/unarchive-list.use-case';
import { DeleteListUseCase } from './application/use-cases/delete-list.use-case';
import { ListBoardListsUseCase } from './application/use-cases/list-board-lists.use-case';
import { LIST_REPOSITORY } from './domain/ports/list.repository';
import { MikroOrmListRepository } from './infraestructure/persist/mikro-orm/repositories/mikro-orm-list.repository';
import { ListMikroEntity } from './infraestructure/persist/mikro-orm/entities/list.mikro-entity';
import { ListsController } from './infraestructure/http/controllers/lists.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([ListMikroEntity]),
    BoardsModule,
    IamModule,
  ],
  controllers: [ListsController],
  providers: [
    CreateListUseCase,
    RenameListUseCase,
    ReorderListUseCase,
    ArchiveListUseCase,
    UnarchiveListUseCase,
    DeleteListUseCase,
    ListBoardListsUseCase,
    { provide: LIST_REPOSITORY, useClass: MikroOrmListRepository },
  ],
  exports: [LIST_REPOSITORY],
})
export class ListModule {}
