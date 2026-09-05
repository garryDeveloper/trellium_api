import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
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
import { ListMyCardsUseCase } from '../../../application/use-cases/list-my-cards.use-case';
import { CardResponseComposer } from '../card-response.composer';
import { MyCardsQueryDto } from '../dto/my-cards.query.dto';
import { MyCardsResponseDto } from '../dto/my-cards.response.dto';

@ApiTags('me')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class MeCardsController {
  constructor(
    private readonly listMyCardsUseCase: ListMyCardsUseCase,
    private readonly cardResponses: CardResponseComposer,
  ) {}

  @Get('me/cards')
  @ApiOkResponse({ type: MyCardsResponseDto })
  async listMyCards(
    @Query() query: MyCardsQueryDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<MyCardsResponseDto> {
    const { cards } = await this.listMyCardsUseCase.execute({
      currentUserId: req.user.sub,
      boardId: query.boardId,
    });

    // Mismo composer que la búsqueda global: responsables, etiquetas y progreso
    // en tres queries para todo el lote, aunque las tarjetas vengan de tableros
    // distintos.
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
    };
  }
}
