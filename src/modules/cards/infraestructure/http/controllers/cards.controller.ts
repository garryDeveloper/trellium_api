import {
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
import { CreateCardUseCase } from '../../../application/use-cases/create-card.use-case';
import { UpdateCardUseCase } from '../../../application/use-cases/update-card.use-case';
import { MoveCardUseCase } from '../../../application/use-cases/move-card.use-case';
import { AssignMemberUseCase } from '../../../application/use-cases/assign-member.use-case';
import { UnassignMemberUseCase } from '../../../application/use-cases/unassign-member.use-case';
import { ListCardAssigneesUseCase } from '../../../application/use-cases/list-card-assignees.use-case';
import { ApplyLabelUseCase } from '../../../application/use-cases/apply-label.use-case';
import { RemoveLabelUseCase } from '../../../application/use-cases/remove-label.use-case';
import { ListCardLabelsUseCase } from '../../../application/use-cases/list-card-labels.use-case';
import { ArchiveCardUseCase } from '../../../application/use-cases/archive-card.use-case';
import { UnarchiveCardUseCase } from '../../../application/use-cases/unarchive-card.use-case';
import { DeleteCardUseCase } from '../../../application/use-cases/delete-card.use-case';
import { ListCardsUseCase } from '../../../application/use-cases/list-cards.use-case';
import { ListCardsChecklistProgressUseCase } from '../../../application/use-cases/list-cards-checklist-progress.use-case';
import { Card } from '../../../domain/entities/card.entity';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { MoveCardDto } from '../dto/move-card.dto';
import { AssignMemberDto } from '../dto/assign-member.dto';
import { ApplyLabelDto } from '../dto/apply-label.dto';
import { ListCardsQueryDto } from '../dto/list-cards.query.dto';
import {
  CardResponseDto,
  ListCardsResponseDto,
} from '../dto/card.response.dto';
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
    private readonly moveCardUseCase: MoveCardUseCase,
    private readonly assignMemberUseCase: AssignMemberUseCase,
    private readonly unassignMemberUseCase: UnassignMemberUseCase,
    private readonly listCardAssigneesUseCase: ListCardAssigneesUseCase,
    private readonly applyLabelUseCase: ApplyLabelUseCase,
    private readonly removeLabelUseCase: RemoveLabelUseCase,
    private readonly listCardLabelsUseCase: ListCardLabelsUseCase,
    private readonly archiveCardUseCase: ArchiveCardUseCase,
    private readonly unarchiveCardUseCase: UnarchiveCardUseCase,
    private readonly deleteCardUseCase: DeleteCardUseCase,
    private readonly listCardsUseCase: ListCardsUseCase,
    private readonly listCardsChecklistProgressUseCase: ListCardsChecklistProgressUseCase,
  ) {}

  @Get('lists/:listId/cards')
  @ApiOkResponse({ type: ListCardsResponseDto })
  async listCards(
    @Param('listId') listId: string,
    @Query() query: ListCardsQueryDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListCardsResponseDto> {
    const cards = await this.listCardsUseCase.execute({
      listId,
      status: query.status ?? 'active',
      currentUserId: req.user.sub,
    });

    return { cards: await this.toResponseDtos(cards) };
  }

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

    return this.toResponseDto(card);
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
      dueDate:
        dto.dueDate === undefined
          ? undefined
          : dto.dueDate === null
            ? null
            : new Date(dto.dueDate),
      currentUserId: req.user.sub,
    });

    return this.toResponseDto(card);
  }

  @Post('cards/:cardId/move')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardResponseDto })
  async moveCard(
    @Param('cardId') cardId: string,
    @Body() dto: MoveCardDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.moveCardUseCase.execute({
      cardId,
      listId: dto.listId,
      position: dto.position,
      currentUserId: req.user.sub,
    });

    return this.toResponseDto(card);
  }

  @Post('cards/:cardId/assignees')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardResponseDto })
  async assignMember(
    @Param('cardId') cardId: string,
    @Body() dto: AssignMemberDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.assignMemberUseCase.execute({
      cardId,
      userId: dto.userId,
      currentUserId: req.user.sub,
    });

    return this.toResponseDto(card);
  }

  @Delete('cards/:cardId/assignees/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardResponseDto })
  async unassignMember(
    @Param('cardId') cardId: string,
    @Param('userId') userId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.unassignMemberUseCase.execute({
      cardId,
      userId,
      currentUserId: req.user.sub,
    });

    return this.toResponseDto(card);
  }

  @Post('cards/:cardId/labels')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardResponseDto })
  async applyLabel(
    @Param('cardId') cardId: string,
    @Body() dto: ApplyLabelDto,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.applyLabelUseCase.execute({
      cardId,
      labelId: dto.labelId,
      currentUserId: req.user.sub,
    });

    return this.toResponseDto(card);
  }

  @Delete('cards/:cardId/labels/:labelId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardResponseDto })
  async removeLabel(
    @Param('cardId') cardId: string,
    @Param('labelId') labelId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.removeLabelUseCase.execute({
      cardId,
      labelId,
      currentUserId: req.user.sub,
    });

    return this.toResponseDto(card);
  }

  @Post('cards/:cardId/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardResponseDto })
  async archiveCard(
    @Param('cardId') cardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.archiveCardUseCase.execute({
      cardId,
      currentUserId: req.user.sub,
    });

    return this.toResponseDto(card);
  }

  @Post('cards/:cardId/unarchive')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CardResponseDto })
  async unarchiveCard(
    @Param('cardId') cardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<CardResponseDto> {
    const card = await this.unarchiveCardUseCase.execute({
      cardId,
      currentUserId: req.user.sub,
    });

    return this.toResponseDto(card);
  }

  @Delete('cards/:cardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Tarjeta eliminada definitivamente.' })
  async deleteCard(
    @Param('cardId') cardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.deleteCardUseCase.execute({
      cardId,
      currentUserId: req.user.sub,
    });
  }

  private async toResponseDto(card: Card): Promise<CardResponseDto> {
    const [dto] = await this.toResponseDtos([card]);
    return dto;
  }

  /**
   * Resuelve responsables, etiquetas y progreso de checklist de todas las
   * tarjetas con tres queries en total, en vez de tres por tarjeta.
   */
  private async toResponseDtos(cards: Card[]): Promise<CardResponseDto[]> {
    const cardIds = cards.map((card) => card.id);

    const [assigneesByCard, labelsByCard, progressByCard] = await Promise.all([
      this.listCardAssigneesUseCase.execute({ cardIds }),
      this.listCardLabelsUseCase.execute({ cardIds }),
      this.listCardsChecklistProgressUseCase.execute({ cardIds }),
    ]);

    return cards.map((card) =>
      CardResponseMapper.toResponseDto(
        card,
        assigneesByCard.get(card.id) ?? [],
        labelsByCard.get(card.id) ?? [],
        progressByCard.get(card.id) ?? null,
      ),
    );
  }
}
