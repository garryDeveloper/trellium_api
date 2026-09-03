import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  CARD_REPOSITORY,
  type CardRepository,
  AssigneeInfo,
} from '../../domain/ports/card.repository';

interface ListCardAssigneesQuery {
  cardIds: string[];
}

/**
 * Resuelve los responsables de varias tarjetas de una sola vez: listar una lista
 * con N tarjetas debe costar una query, no N.
 */
@Injectable()
export class ListCardAssigneesUseCase implements UseCase<
  ListCardAssigneesQuery,
  Map<string, AssigneeInfo[]>
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
  ) {}

  execute(query: ListCardAssigneesQuery): Promise<Map<string, AssigneeInfo[]>> {
    return this.cards.findAssigneesByCards(query.cardIds);
  }
}
