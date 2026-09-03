import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  CARD_REPOSITORY,
  type CardRepository,
  CardLabelInfo,
} from '../../domain/ports/card.repository';

interface ListCardLabelsQuery {
  cardIds: string[];
}

/** Mismo criterio que `ListCardAssigneesUseCase`: una query para N tarjetas. */
@Injectable()
export class ListCardLabelsUseCase implements UseCase<
  ListCardLabelsQuery,
  Map<string, CardLabelInfo[]>
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
  ) {}

  execute(query: ListCardLabelsQuery): Promise<Map<string, CardLabelInfo[]>> {
    return this.cards.findLabelsByCards(query.cardIds);
  }
}
