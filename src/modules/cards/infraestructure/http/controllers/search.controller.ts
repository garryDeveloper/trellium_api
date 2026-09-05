import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
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
import { BoardResponseMapper } from 'src/modules/boards/infrastructure/http/mappers/board.response.mapper';
import { SearchUseCase } from '../../../application/use-cases/search.use-case';
import { CardResponseComposer } from '../card-response.composer';
import { DEFAULT_SEARCH_LIMIT, SearchQueryDto } from '../dto/search.query.dto';
import { SearchResponseDto } from '../dto/search.response.dto';

@ApiTags('search')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class SearchController {
  constructor(
    private readonly searchUseCase: SearchUseCase,
    private readonly cardResponses: CardResponseComposer,
  ) {}

  @Get('search')
  @ApiOkResponse({ type: SearchResponseDto })
  @ApiBadRequestResponse({ description: '`q` tiene menos de 2 caracteres.' })
  async search(
    @Query() query: SearchQueryDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<SearchResponseDto> {
    const { cards, boards } = await this.searchUseCase.execute({
      currentUserId: req.user.sub,
      query: query.q,
      includeArchived: query.includeArchived ?? false,
      limit: query.limit ?? DEFAULT_SEARCH_LIMIT,
    });

    // Las tarjetas se completan en lote (una sola pasada por responsables,
    // etiquetas y checklists) aunque vengan de tableros distintos.
    const cardDtos = await this.cardResponses.toResponseDtos(
      cards.map((hit) => hit.card),
    );

    return {
      cards: cards.map((hit, index) => ({
        card: cardDtos[index],
        listId: hit.card.listId,
        listName: hit.listName,
        boardId: hit.boardId,
        boardName: hit.boardName,
      })),
      boards: boards.map((board) => BoardResponseMapper.toResponseDto(board)),
    };
  }
}
