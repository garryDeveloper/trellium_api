import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Board } from 'src/modules/boards/domain/entities/board.entity';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import {
  CARD_REPOSITORY,
  type CardRepository,
  type CardWithLocation,
} from '../../domain/ports/card.repository';

export interface SearchQuery {
  currentUserId: string;
  query: string;
  includeArchived: boolean;
  limit: number;
}

export interface SearchResult {
  cards: CardWithLocation[];
  boards: Board[];
}

/**
 * Búsqueda global (T11.2): tarjetas y tableros a través de todo lo que el
 * usuario puede ver.
 *
 * Vive en `cards` y no en un módulo propio porque la búsqueda no es un dominio:
 * es una lectura sobre dominios que ya existen (`backend-architecture.md`). Los
 * dos repositorios resuelven la membresía dentro de su propia query, así que
 * este caso de uso no tiene ninguna decisión de autorización que tomar: no hay
 * un camino por el que un resultado ajeno llegue hasta acá y haya que filtrarlo
 * después.
 */
@Injectable()
export class SearchUseCase implements UseCase<SearchQuery, SearchResult> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(query: SearchQuery): Promise<SearchResult> {
    const criteria = {
      userId: query.currentUserId,
      query: query.query,
      includeArchived: query.includeArchived,
      limit: query.limit,
    };

    // En paralelo: son dos búsquedas independientes y el usuario espera por la
    // más lenta de las dos, no por la suma.
    const [cards, boards] = await Promise.all([
      this.cards.searchForMember(criteria),
      this.boards.searchForMember(criteria),
    ]);

    return { cards, boards };
  }
}
