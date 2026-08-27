import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { ChangeStatusUseCase } from 'src/modules/boards/application/use-cases/change-status.use-case';
import { BoardResponseMapper } from '../mappers/board.response.mapper';
import { UpdateBoardNameRequestDto } from '../dto/change-name.request.dto';
import { ChangeNameUseCase } from 'src/modules/boards/application/use-cases/change-name.use-case';

@ApiTags('boards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly listMyBoardsUseCase: ListMyBoardsUseCase,
    private readonly changeBoardStatusUseCase: ChangeStatusUseCase,
    private readonly changeBoardNameUseCase: ChangeNameUseCase,
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
      boards: boards.map((summary) =>
        BoardResponseMapper.toListItemDto(summary),
      ),
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

    return BoardResponseMapper.toResponseDto(board);
  }

  @Post('/:boardId/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BoardResponseDto })
  async archiveBoard(
    @Param('boardId') boardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<BoardResponseDto> {
    const board = await this.changeBoardStatusUseCase.execute({
      boardId: boardId,
      status: 'archived',
      userId: req.user.sub,
    });

    return BoardResponseMapper.toResponseDto(board);
  }

  @Post('/:boardId/unarchive')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BoardResponseDto })
  async unarchiveBoard(
    @Param('boardId') boardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<BoardResponseDto> {
    const board = await this.changeBoardStatusUseCase.execute({
      boardId: boardId,
      status: 'active',
      userId: req.user.sub,
    });

    return BoardResponseMapper.toResponseDto(board);
  }

  @Patch('/:boardId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BoardResponseDto })
  async changeBoardName(
    @Param('boardId') boardId: string,
    @Body() dto: UpdateBoardNameRequestDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<BoardResponseDto> {
    const board = await this.changeBoardNameUseCase.execute({
      boardId: boardId,
      name: dto.name,
      userId: req.user.sub,
    });

    return BoardResponseMapper.toResponseDto(board);
  }
}
