import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';
import mikroOrmConfig from './shared/infrastructure/persistence/mikro-orm.config';
import { IamModule } from './modules/iam/iam.module';
import { BoardsModule } from './modules/boards/boards.module';
import { ListModule } from './modules/lists/list.module';
import { CardModule } from './modules/cards/card.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { HealthController } from './shared/infrastructure/http/controllers/health.controller';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ScheduleModule.forRoot(),
    IamModule,
    BoardsModule,
    ListModule,
    CardModule,
    NotificationsModule,
    ActivitiesModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
