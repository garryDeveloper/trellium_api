import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { ListMyNotificationsUseCase } from '../../../application/use-cases/list-my-notifications.use-case';
import { MarkAllNotificationsReadUseCase } from '../../../application/use-cases/mark-all-notifications-read.use-case';
import { MarkNotificationReadUseCase } from '../../../application/use-cases/mark-notification-read.use-case';
import {
  ListNotificationsResponseDto,
  NotificationResponseDto,
} from '../dto/notification.response.dto';
import { NotificationResponseMapper } from '../mappers/notification.response.mapper';

@ApiTags('notifications')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class MeNotificationsController {
  constructor(
    private readonly listMyNotificationsUseCase: ListMyNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  @Get('me/notifications')
  @ApiOkResponse({ type: ListNotificationsResponseDto })
  async listMyNotifications(
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListNotificationsResponseDto> {
    const notifications = await this.listMyNotificationsUseCase.execute({
      currentUserId: req.user.sub,
    });

    return {
      notifications: notifications.map((entry) =>
        NotificationResponseMapper.toResponseDto(entry),
      ),
      unreadCount: notifications.filter((entry) => !entry.notification.isRead)
        .length,
    };
  }

  @Patch('notifications/:notificationId/read')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: NotificationResponseDto })
  async markAsRead(
    @Param('notificationId') notificationId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<NotificationResponseDto> {
    const entry = await this.markNotificationReadUseCase.execute({
      notificationId,
      currentUserId: req.user.sub,
    });

    return NotificationResponseMapper.toResponseDto(entry);
  }

  @Post('me/notifications/read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { properties: { updated: { type: 'number' } } } })
  async markAllAsRead(
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<{ updated: number }> {
    const updated = await this.markAllNotificationsReadUseCase.execute({
      currentUserId: req.user.sub,
    });

    return { updated };
  }
}
