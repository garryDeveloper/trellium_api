import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  CHECKLIST_REPOSITORY,
  type ChecklistRepository,
  type ChecklistProgress,
} from '../../domain/ports/checklist.repository';

interface ListCardsChecklistProgressQuery {
  cardIds: string[];
}

/**
 * Progreso de checklist de varias tarjetas en una query (T7.2). El tablero
 * muestra el contador en cada tarjeta sin abrirla, así que esto se resuelve
 * junto con el listado, no por tarjeta.
 */
@Injectable()
export class ListCardsChecklistProgressUseCase implements UseCase<
  ListCardsChecklistProgressQuery,
  Map<string, ChecklistProgress>
> {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepository,
  ) {}

  execute(
    query: ListCardsChecklistProgressQuery,
  ): Promise<Map<string, ChecklistProgress>> {
    return this.checklists.findProgressByCards(query.cardIds);
  }
}
