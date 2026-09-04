export interface DirectoryUser {
  id: string;
  name: string;
}

/**
 * Vista angosta de `iam` que necesita `cards`: resolver el nombre de quien
 * dispara el evento, para guardarlo en la notificación. Mismo patrón que
 * `boards/application/ports/user-directory.port.ts`.
 */
export interface UserDirectoryPort {
  findUserById(userId: string): Promise<DirectoryUser | null>;
}

export const USER_DIRECTORY_PORT = Symbol('CARDS_USER_DIRECTORY_PORT');
