import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/ports/notification.repository';

interface MarkAllNotificationsReadCommand {
  currentUserId: string;
}

@Injectable()
export class MarkAllNotificationsReadUseCase implements UseCase<
  MarkAllNotificationsReadCommand,
  number
> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
  ) {}

  execute(command: MarkAllNotificationsReadCommand): Promise<number> {
    return this.notifications.markAllAsRead(command.currentUserId);
  }
}
