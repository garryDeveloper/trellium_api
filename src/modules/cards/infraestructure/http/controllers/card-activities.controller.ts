import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { ListCardActivitiesUseCase } from '../../../application/use-cases/list-card-activities.use-case';
import { ListActivitiesResponseDto } from '../dto/activity.response.dto';
import { ActivityResponseMapper } from '../mappers/activity.response.mapper';

@ApiTags('activities')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class CardActivitiesController {
  constructor(
    private readonly listCardActivitiesUseCase: ListCardActivitiesUseCase,
  ) {}

  @Get('cards/:cardId/activities')
  @ApiOkResponse({ type: ListActivitiesResponseDto })
  @ApiForbiddenResponse({ description: 'No sos miembro del tablero.' })
  @ApiNotFoundResponse({ description: 'La tarjeta no existe.' })
  async listCardActivities(
    @Param('cardId') cardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListActivitiesResponseDto> {
    const activities = await this.listCardActivitiesUseCase.execute({
      cardId,
      currentUserId: req.user.sub,
    });

    return {
      activities: activities.map((activity) =>
        ActivityResponseMapper.toResponseDto(activity),
      ),
    };
  }
}
