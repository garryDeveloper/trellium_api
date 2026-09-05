export const BOARD_VIEWS = ['board', 'table', 'calendar'] as const;
export type BoardView = (typeof BOARD_VIEWS)[number];

export const BOARD_GROUP_BY_OPTIONS = [
  'list',
  'assignee',
  'label',
  'due_date',
] as const;
export type BoardGroupBy = (typeof BOARD_GROUP_BY_OPTIONS)[number];

export const DEFAULT_BOARD_VIEW: BoardView = 'board';
export const DEFAULT_BOARD_GROUP_BY: BoardGroupBy = 'list';

export interface BoardViewPreferencesProps {
  boardId: string;
  userId: string;
  view: BoardView;
  groupBy: BoardGroupBy;
  updatedAt: Date;
}

/**
 * Cómo prefiere ver un tablero un usuario concreto (T12.1, T12.3). La identidad
 * es el par (tablero, usuario) — como `BoardMember`, no lleva id propio.
 *
 * No es una regla de negocio del dominio sino una preferencia de presentación:
 * por eso no valida nada más allá de sus enums, y por eso "nunca eligió" no es
 * un caso de error sino `defaults()`.
 */
export class BoardViewPreferences {
  private constructor(private readonly props: BoardViewPreferencesProps) {}

  /**
   * Lo que ve quien nunca eligió: el tablero de siempre, agrupado por lista.
   * Se devuelve en vez de `null` para que el cliente no tenga que replicar los
   * valores por defecto (`endpoints.md`, `GET /boards/{id}/view-preferences`).
   */
  static defaults(boardId: string, userId: string): BoardViewPreferences {
    return new BoardViewPreferences({
      boardId,
      userId,
      view: DEFAULT_BOARD_VIEW,
      groupBy: DEFAULT_BOARD_GROUP_BY,
      updatedAt: new Date(),
    });
  }

  static fromPersistence(
    props: BoardViewPreferencesProps,
  ): BoardViewPreferences {
    return new BoardViewPreferences(props);
  }

  static create(props: {
    boardId: string;
    userId: string;
    view: BoardView;
    groupBy: BoardGroupBy;
  }): BoardViewPreferences {
    return new BoardViewPreferences({ ...props, updatedAt: new Date() });
  }

  get boardId(): string {
    return this.props.boardId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get view(): BoardView {
    return this.props.view;
  }

  get groupBy(): BoardGroupBy {
    return this.props.groupBy;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
