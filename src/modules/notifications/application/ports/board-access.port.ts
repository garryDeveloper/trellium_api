/**
 * Vista angosta de `boards` que necesitan las notificaciones: saber a cuáles de
 * los tableros referenciados el usuario todavía tiene acceso. Mismo patrón que
 * `USER_DIRECTORY_PORT`.
 */
export interface BoardAccessPort {
  /** Subconjunto de `boardIds` donde `userId` sigue siendo miembro. */
  filterAccessibleBoardIds(
    userId: string,
    boardIds: string[],
  ): Promise<Set<string>>;
}

export const BOARD_ACCESS_PORT = Symbol('BOARD_ACCESS_PORT');
