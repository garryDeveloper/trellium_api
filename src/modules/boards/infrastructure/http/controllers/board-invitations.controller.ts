import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { InviteMemberUseCase } from 'src/modules/boards/application/use-cases/invite-member.use-case';
import { ListBoardInvitationsUseCase } from 'src/modules/boards/application/use-cases/list-board-invitations.use-case';
import { CancelInvitationUseCase } from 'src/modules/boards/application/use-cases/cancel-invitation.use-case';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { InvitationResponseDto } from '../dto/invitation.response.dto';
import { ListBoardInvitationsResponseDto } from '../dto/list-board-invitations.response.dto';
import { BoardResponseMapper } from '../mappers/board.response.mapper';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/invitations')
export class BoardInvitationsController {
  constructor(
    private readonly inviteMemberUseCase: InviteMemberUseCase,
    private readonly listBoardInvitationsUseCase: ListBoardInvitationsUseCase,
    private readonly cancelInvitationUseCase: CancelInvitationUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: InvitationResponseDto })
  async inviteMember(
    @Param('boardId') boardId: string,
    @Body() dto: InviteMemberDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<InvitationResponseDto> {
    const invitation = await this.inviteMemberUseCase.execute({
      boardId,
      email: dto.email,
      invitedByUserId: req.user.sub,
    });

    return BoardResponseMapper.toInvitationDto(invitation);
  }

  @Get()
  @ApiOkResponse({ type: ListBoardInvitationsResponseDto })
  async listInvitations(
    @Param('boardId') boardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListBoardInvitationsResponseDto> {
    const invitations = await this.listBoardInvitationsUseCase.execute({
      boardId,
      userId: req.user.sub,
    });

    return {
      invitations: invitations.map((invitation) =>
        BoardResponseMapper.toInvitationDto(invitation),
      ),
    };
  }

  @Delete('/:invitationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Invitación cancelada.' })
  async cancelInvitation(
    @Param('boardId') boardId: string,
    @Param('invitationId') invitationId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.cancelInvitationUseCase.execute({
      boardId,
      invitationId,
      userId: req.user.sub,
    });
  }
}
