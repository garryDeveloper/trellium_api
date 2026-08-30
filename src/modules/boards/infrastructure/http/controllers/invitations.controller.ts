import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
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
import { AcceptInvitationUseCase } from 'src/modules/boards/application/use-cases/accept-invitation.use-case';
import { RejectInvitationUseCase } from 'src/modules/boards/application/use-cases/reject-invitation.use-case';
import { AcceptInvitationResponseDto } from '../dto/accept-invitation.response.dto';
import { InvitationResponseDto } from '../dto/invitation.response.dto';
import { BoardResponseMapper } from '../mappers/board.response.mapper';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly acceptInvitationUseCase: AcceptInvitationUseCase,
    private readonly rejectInvitationUseCase: RejectInvitationUseCase,
  ) {}

  @Post('/:invitationId/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AcceptInvitationResponseDto })
  async accept(
    @Param('invitationId') invitationId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<AcceptInvitationResponseDto> {
    const board = await this.acceptInvitationUseCase.execute({
      invitationId,
      userId: req.user.sub,
      userEmail: req.user.email,
    });

    return { board: BoardResponseMapper.toResponseDto(board) };
  }

  @Post('/:invitationId/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: InvitationResponseDto })
  async reject(
    @Param('invitationId') invitationId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<InvitationResponseDto> {
    const invitation = await this.rejectInvitationUseCase.execute({
      invitationId,
      userEmail: req.user.email,
    });

    return BoardResponseMapper.toInvitationDto(invitation);
  }
}
