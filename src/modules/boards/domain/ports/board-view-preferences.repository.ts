import { BoardViewPreferences } from '../entities/board-view-preferences.entity';

export interface BoardViewPreferencesRepository {
  find(boardId: string, userId: string): Promise<BoardViewPreferences | null>;
  /**
   * Upsert: la fila se crea la primera vez que el usuario elige una vista y se
   * pisa después. No hay `create` aparte porque el cliente no distingue los dos
   * casos — siempre hace `PUT`.
   */
  save(preferences: BoardViewPreferences): Promise<BoardViewPreferences>;
}

export const BOARD_VIEW_PREFERENCES_REPOSITORY = Symbol(
  'BOARD_VIEW_PREFERENCES_REPOSITORY',
);
