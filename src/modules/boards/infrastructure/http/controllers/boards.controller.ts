import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { CreateBoardUseCase } from '../../../application/use-cases/create-board.use-case';
import { ListMyBoardsUseCase } from '../../../application/use-cases/list-my-boards.use-case';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { CreateBoardDto } from '../dto/create-board.dto';
import { BoardResponseDto } from '../dto/board.response.dto';
import { ListBoardsQueryDto } from '../dto/list-boards.query.dto';
import { ListBoardsResponseDto } from '../dto/board-list-item.response.dto';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly listMyBoardsUseCase: ListMyBoardsUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ListBoardsResponseDto })
  async listMyBoards(
    @Query() query: ListBoardsQueryDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListBoardsResponseDto> {
    const boards = await this.listMyBoardsUseCase.execute({
      userId: req.user.sub,
      status: query.status ?? 'active',
    });

    return {
      boards: boards.map((board) => ({
        id: board.id,
        name: board.name,
        ownerId: board.ownerId,
        status: board.status,
        createdAt: board.createdAt.toISOString(),
        role: board.role,
        memberCount: board.memberCount,
      })),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: BoardResponseDto })
  async createBoard(
    @Body() dto: CreateBoardDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<BoardResponseDto> {
    const board = await this.createBoardUseCase.execute({
      name: dto.name,
      ownerId: req.user.sub,
    });

    return {
      id: board.id,
      name: board.name,
      ownerId: board.ownerId,
      status: board.status,
      createdAt: board.createdAt.toISOString(),
    };
  }
}
