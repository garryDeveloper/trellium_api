import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { IamModule } from '../iam/iam.module';
import { BoardsModule } from '../boards/boards.module';
import { NOTIFICATION_PUBLISHER } from 'src/shared/application/ports/notification-publisher.port';
import { ListMyNotificationsUseCase } from './application/use-cases/list-my-notifications.use-case';
import { MarkAllNotificationsReadUseCase } from './application/use-cases/mark-all-notifications-read.use-case';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read.use-case';
import { NOTIFICATION_REPOSITORY } from './domain/ports/notification.repository';
import { BOARD_ACCESS_PORT } from './application/ports/board-access.port';
import { NotificationMikroEntity } from './infraestructure/persist/mikro-orm/entities/notification.mikro-entity';
import { MikroOrmNotificationRepository } from './infraestructure/persist/mikro-orm/repositories/mikro-orm-notification.repository';
import { NotificationPublisherAdapter } from './infraestructure/adapters/notification-publisher.adapter';
import { BoardsAccessAdapter } from './infraestructure/adapters/boards-access.adapter';
import { MeNotificationsController } from './infraestructure/http/controllers/me-notifications.controller';

@Module({
  // `IamModule` por el `JwtAuthGuard` del controller, igual que el resto de los
  // módulos con rutas autenticadas.
  imports: [
    MikroOrmModule.forFeature([NotificationMikroEntity]),
    IamModule,
    // `forwardRef` porque BoardsModule ya importa NotificationsModule para
    // publicar la notificación de invitación (T9.1).
    forwardRef(() => BoardsModule),
  ],
  controllers: [MeNotificationsController],
  providers: [
    ListMyNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: MikroOrmNotificationRepository,
    },
    { provide: NOTIFICATION_PUBLISHER, useClass: NotificationPublisherAdapter },
    { provide: BOARD_ACCESS_PORT, useClass: BoardsAccessAdapter },
  ],
  // `cards` y `boards` solo necesitan publicar, así que hacia afuera se expone
  // el puerto angosto y no el repositorio.
  exports: [NOTIFICATION_PUBLISHER],
})
export class NotificationsModule {}
