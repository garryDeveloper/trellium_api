import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  ACTIVITY_REPOSITORY,
  type ActivityRepository,
  type ActivityWithActor,
} from 'src/modules/activities/domain/ports/activity.repository';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';

interface ListCardActivitiesQuery {
  cardId: string;
  currentUserId: string;
}

/**
 * Historial de una tarjeta (T13.1).
 *
 * Vive en `cards` y no en `activities` por la misma razón que `search` y
 * `me/cards`: es una lectura sobre un dominio que ya existe, y su autorización
 * es la de la tarjeta. Además evita que los dos módulos se importen
 * mutuamente — `activities` no conoce a nadie.
 *
 * No devuelve comentarios: el cliente los pide a `GET /cards/{id}/comments` y
 * los intercala por fecha (`endpoints.md`). Un comentario es contenido editable
 * de una persona; un evento es un registro inmutable del sistema.
 */
@Injectable()
export class ListCardActivitiesUseCase implements UseCase<
  ListCardActivitiesQuery,
  ActivityWithActor[]
> {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activities: ActivityRepository,
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(query: ListCardActivitiesQuery): Promise<ActivityWithActor[]> {
    // Un solo join tarjeta -> lista -> tablero, en vez de dos round-trips.
    const boardId = await this.cards.findBoardIdByCard(query.cardId);
    if (!boardId) {
      throw new CardNotFoundError();
    }

    const isMember = await this.boards.isMember(boardId, query.currentUserId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    return this.activities.findByCard(query.cardId);
  }
}
