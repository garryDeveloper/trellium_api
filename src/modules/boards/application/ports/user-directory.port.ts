export interface UserDirectoryPort {
  findUserIdByEmail(email: string): Promise<string | null>;
  /** Para guardar quién disparó el evento en la notificación. */
  findUserNameById(userId: string): Promise<string | null>;
}

export const USER_DIRECTORY_PORT = Symbol('USER_DIRECTORY_PORT');
