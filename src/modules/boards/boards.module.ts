import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { IamModule } from '../iam/iam.module';
import { CreateBoardUseCase } from './application/use-cases/create-board.use-case';
import { BOARD_REPOSITORY } from './domain/ports/board.repository';
import { MikroOrmBoardRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-board.repository';
import { BoardMikroEntity } from './infrastructure/persistence/mikro-orm/entities/board.mikro-entity';
import { BoardMemberMikroEntity } from './infrastructure/persistence/mikro-orm/entities/board-member.mikro-entity';
import { BoardsController } from './infrastructure/http/controllers/boards.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([BoardMikroEntity, BoardMemberMikroEntity]),
    IamModule,
  ],
  controllers: [BoardsController],
  providers: [
    CreateBoardUseCase,
    { provide: BOARD_REPOSITORY, useClass: MikroOrmBoardRepository },
  ],
  exports: [BOARD_REPOSITORY],
})
export class BoardsModule {}
