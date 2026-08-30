import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { ListBoardMembersUseCase } from 'src/modules/boards/application/use-cases/list-board-members.use-case';
import { RemoveMemberUseCase } from 'src/modules/boards/application/use-cases/remove-member.use-case';
import { ListBoardMembersResponseDto } from '../dto/board-member.response.dto';
import { BoardResponseMapper } from '../mappers/board.response.mapper';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/members')
export class BoardMembersController {
  constructor(
    private readonly listBoardMembersUseCase: ListBoardMembersUseCase,
    private readonly removeMemberUseCase: RemoveMemberUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ListBoardMembersResponseDto })
  async listMembers(
    @Param('boardId') boardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListBoardMembersResponseDto> {
    const members = await this.listBoardMembersUseCase.execute({
      boardId,
      userId: req.user.sub,
    });

    return {
      members: members.map((member) => BoardResponseMapper.toMemberDto(member)),
    };
  }

  @Delete('/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Miembro removido del tablero.' })
  async removeMember(
    @Param('boardId') boardId: string,
    @Param('userId') userId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.removeMemberUseCase.execute({
      boardId,
      userId,
      requesterId: req.user.sub,
    });
  }
}
