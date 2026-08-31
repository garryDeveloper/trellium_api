import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { List } from '../../../domain/entities/list.entity';
import { CreateListUseCase } from '../../../application/use-cases/create-list.use-case';
import { RenameListUseCase } from '../../../application/use-cases/rename-list.use-case';
import { ReorderListUseCase } from '../../../application/use-cases/reorder-list.use-case';
import { ArchiveListUseCase } from '../../../application/use-cases/archive-list.use-case';
import { UnarchiveListUseCase } from '../../../application/use-cases/unarchive-list.use-case';
import { DeleteListUseCase } from '../../../application/use-cases/delete-list.use-case';
import { ListBoardListsUseCase } from '../../../application/use-cases/list-board-lists.use-case';
import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListRequestDto } from '../dto/update-list.request.dto';
import { ListBoardListsQueryDto } from '../dto/list-board-lists.query.dto';
import {
  ListBoardListsResponseDto,
  ListResponseDto,
} from '../dto/list.response.dto';
import { ListResponseMapper } from '../mappers/list.response.mapper';

@ApiTags('lists')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class ListsController {
  constructor(
    private readonly createListUseCase: CreateListUseCase,
    private readonly renameListUseCase: RenameListUseCase,
    private readonly reorderListUseCase: ReorderListUseCase,
    private readonly archiveListUseCase: ArchiveListUseCase,
    private readonly unarchiveListUseCase: UnarchiveListUseCase,
    private readonly deleteListUseCase: DeleteListUseCase,
    private readonly listBoardListsUseCase: ListBoardListsUseCase,
  ) {}

  @Get('boards/:boardId/lists')
  @ApiOkResponse({ type: ListBoardListsResponseDto })
  async listBoardLists(
    @Param('boardId') boardId: string,
    @Query() query: ListBoardListsQueryDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListBoardListsResponseDto> {
    const lists = await this.listBoardListsUseCase.execute({
      boardId,
      status: query.status ?? 'active',
      currentUserId: req.user.sub,
    });

    return { lists: lists.map((list) => ListResponseMapper.toResponseDto(list)) };
  }

  @Post('boards/:boardId/lists')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ListResponseDto })
  async createList(
    @Param('boardId') boardId: string,
    @Body() dto: CreateListDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListResponseDto> {
    const list = await this.createListUseCase.execute({
      boardId,
      name: dto.name,
      currentUserId: req.user.sub,
    });

    return ListResponseMapper.toResponseDto(list);
  }

  @Patch('lists/:listId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListResponseDto })
  async updateList(
    @Param('listId') listId: string,
    @Body() dto: UpdateListRequestDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListResponseDto> {
    if (dto.name === undefined && dto.position === undefined) {
      throw new BadRequestException(
        'Debes indicar al menos "name" o "position".',
      );
    }

    let list: List | undefined;

    if (dto.name !== undefined) {
      list = await this.renameListUseCase.execute({
        listId,
        name: dto.name,
        currentUserId: req.user.sub,
      });
    }

    if (dto.position !== undefined) {
      list = await this.reorderListUseCase.execute({
        listId,
        position: dto.position,
        currentUserId: req.user.sub,
      });
    }

    return ListResponseMapper.toResponseDto(list as List);
  }

  @Post('lists/:listId/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListResponseDto })
  async archiveList(
    @Param('listId') listId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListResponseDto> {
    const list = await this.archiveListUseCase.execute({
      listId,
      currentUserId: req.user.sub,
    });

    return ListResponseMapper.toResponseDto(list);
  }

  @Post('lists/:listId/unarchive')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListResponseDto })
  async unarchiveList(
    @Param('listId') listId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListResponseDto> {
    const list = await this.unarchiveListUseCase.execute({
      listId,
      currentUserId: req.user.sub,
    });

    return ListResponseMapper.toResponseDto(list);
  }

  @Delete('lists/:listId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Lista eliminada definitivamente.' })
  async deleteList(
    @Param('listId') listId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.deleteListUseCase.execute({
      listId,
      currentUserId: req.user.sub,
    });
  }
}
