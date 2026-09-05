import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  CARD_REPOSITORY,
  type CardRepository,
  type CardWithLocation,
} from '../../domain/ports/card.repository';

export interface ListMyCardsQuery {
  currentUserId: string;
  /** Opcional: sólo las tarjetas de ese tablero. */
  boardId?: string;
}

export interface ListMyCardsResult {
  cards: CardWithLocation[];
}

/**
 * "Mi trabajo" (T12.4): todo lo que el usuario tiene asignado, en cualquier
 * tablero donde siga siendo miembro.
 *
 * Igual que la búsqueda global, es una lectura sobre dominios que ya existen y
 * vive en `cards` en vez de en un módulo propio (`backend-architecture.md`). No
 * toma ninguna decisión de autorización: la membresía y los archivados los
 * resuelve la query del repositorio, así que no hay resultados ajenos que
 * filtrar después.
 *
 * Tampoco agrupa por vencimiento. Los grupos de la pantalla —vencidas, hoy,
 * esta semana— dependen de la zona horaria de quien mira, que el servidor no
 * conoce; el estado de vencimiento es derivado y se deriva donde está el reloj
 * del usuario (`domain.md`, estados de Tarjeta).
 */
@Injectable()
export class ListMyCardsUseCase implements UseCase<
  ListMyCardsQuery,
  ListMyCardsResult
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
  ) {}

  async execute(query: ListMyCardsQuery): Promise<ListMyCardsResult> {
    const cards = await this.cards.findAssignedToMember({
      userId: query.currentUserId,
      boardId: query.boardId,
    });

    return { cards };
  }
}
