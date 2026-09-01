import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  CARD_REPOSITORY,
  type CardRepository,
  CardLabelInfo,
} from '../../domain/ports/card.repository';

interface ListCardLabelsQuery {
  cardId: string;
}

@Injectable()
export class ListCardLabelsUseCase implements UseCase<
  ListCardLabelsQuery,
  CardLabelInfo[]
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
  ) {}

  execute(query: ListCardLabelsQuery): Promise<CardLabelInfo[]> {
    return this.cards.findLabels(query.cardId);
  }
}
