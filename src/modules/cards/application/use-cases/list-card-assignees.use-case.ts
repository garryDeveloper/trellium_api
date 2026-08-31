import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  AssigneeInfo,
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';

interface ListCardAssigneesQuery {
  cardId: string;
}

@Injectable()
export class ListCardAssigneesUseCase implements UseCase<
  ListCardAssigneesQuery,
  AssigneeInfo[]
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
  ) {}

  execute(query: ListCardAssigneesQuery): Promise<AssigneeInfo[]> {
    return this.cards.findAssignees(query.cardId);
  }
}
