import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';
import mikroOrmConfig from './shared/infrastructure/persistence/mikro-orm.config';
import { IamModule } from './modules/iam/iam.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ScheduleModule.forRoot(),
    IamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
