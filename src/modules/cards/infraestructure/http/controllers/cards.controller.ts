import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { CreateCardUseCase } from '../../../application/use-cases/create-card.use-case';
import { UpdateCardUseCase } from '../../../application/use-cases/update-card.use-case';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { CardResponseDto } from '../dto/card.response.dto';
import { CardResponseMapper } from '../mappers/card.response.mapper';

@ApiTags('cards')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class CardsController {
  constructor(
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
  ) {}

  @Post('lists/:listId/cards')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CardResponseDto })
  async createCard(
    @Param('listId') listId: string,
    @Body() dto: CreateCardDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.createCardUseCase.execute({
      listId,
      title: dto.title,
      currentUserId: req.user.sub,
    });

    return CardResponseMapper.toResponseDto(card);
  }

  @Patch('cards/:cardId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardResponseDto })
  async updateCard(
    @Param('cardId') cardId: string,
    @Body() dto: UpdateCardDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.updateCardUseCase.execute({
      cardId,
      title: dto.title,
      description: dto.description,
      currentUserId: req.user.sub,
    });

    return CardResponseMapper.toResponseDto(card);
  }
}
