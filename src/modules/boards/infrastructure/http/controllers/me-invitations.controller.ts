import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
import { ListMyInvitationsUseCase } from 'src/modules/boards/application/use-cases/list-my-invitations.use-case';
import { ListMyInvitationsResponseDto } from '../dto/my-invitation.response.dto';
import { BoardResponseMapper } from '../mappers/board.response.mapper';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('me/invitations')
export class MeInvitationsController {
  constructor(
    private readonly listMyInvitationsUseCase: ListMyInvitationsUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ListMyInvitationsResponseDto })
  async listMyInvitations(
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListMyInvitationsResponseDto> {
    const invitations = await this.listMyInvitationsUseCase.execute({
      userEmail: req.user.email,
    });

    return {
      invitations: invitations.map((summary) =>
        BoardResponseMapper.toMyInvitationDto(summary),
      ),
    };
  }
}
