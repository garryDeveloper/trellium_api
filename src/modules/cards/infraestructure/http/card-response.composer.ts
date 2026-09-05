import { Injectable } from '@nestjs/common';
import { ListCardAssigneesUseCase } from '../../application/use-cases/list-card-assignees.use-case';
import { ListCardLabelsUseCase } from '../../application/use-cases/list-card-labels.use-case';
import { ListCardsChecklistProgressUseCase } from '../../application/use-cases/list-cards-checklist-progress.use-case';
import { Card } from '../../domain/entities/card.entity';
import { CardResponseDto } from './dto/card.response.dto';
import { CardResponseMapper } from './mappers/card.response.mapper';

/**
 * Arma el `CardResponseDto` completo de un conjunto de tarjetas.
 *
 * Está acá y no repetido en cada controller porque lo que hay que no perder es
 * el lote: responsables, etiquetas y progreso de checklist se resuelven con
 * tres queries en total y no con tres por tarjeta. La búsqueda global (T11.2)
 * devuelve tarjetas de tableros distintos y necesita exactamente lo mismo que
 * el listado de una lista, así que comparten esta pieza.
 */
@Injectable()
export class CardResponseComposer {
  constructor(
    private readonly listCardAssigneesUseCase: ListCardAssigneesUseCase,
    private readonly listCardLabelsUseCase: ListCardLabelsUseCase,
    private readonly listCardsChecklistProgressUseCase: ListCardsChecklistProgressUseCase,
  ) {}

  async toResponseDto(card: Card): Promise<CardResponseDto> {
    const [dto] = await this.toResponseDtos([card]);
    return dto;
  }

  async toResponseDtos(cards: Card[]): Promise<CardResponseDto[]> {
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
