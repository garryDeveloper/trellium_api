import { createReadStream } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { dirname, join, resolve, sep } from 'path';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import {
  AttachmentStorage,
  StoredFile,
} from 'src/modules/cards/domain/ports/attachment-storage.port';

/**
 * Guarda los adjuntos en disco, bajo `ATTACHMENTS_DIR` (por defecto `uploads/`).
 *
 * Nada de lo que manda el cliente llega al path: el nombre es un UUID y la
 * extensión sale del MIME ya validado contra la whitelist. `resolveKey` es la
 * red de seguridad para las lecturas y borrados, que reciben una key guardada
 * en la base.
 */
@Injectable()
export class LocalAttachmentStorage implements AttachmentStorage {
  private readonly root = resolve(
    process.env.ATTACHMENTS_DIR ?? join(process.cwd(), 'uploads'),
  );

  async save({
    cardId,
    extension,
    content,
  }: {
    cardId: string;
    extension: string;
    content: Buffer;
  }): Promise<StoredFile> {
    const storageKey = `${cardId}/${randomUUID()}.${extension}`;
    const target = this.resolveKey(storageKey);

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);

    return { storageKey };
  }

  createReadStream(storageKey: string): NodeJS.ReadableStream {
    return createReadStream(this.resolveKey(storageKey));
  }

  async delete(storageKey: string): Promise<void> {
    // `force` traga el ENOENT: si el archivo ya no está, el borrado igual está
    // conseguido y no tiene sentido romper la request.
    await rm(this.resolveKey(storageKey), { force: true });
  }

  /** Impide que una key manipulada escape del directorio de adjuntos. */
  private resolveKey(storageKey: string): string {
    const target = resolve(this.root, storageKey);
    if (target !== this.root && !target.startsWith(this.root + sep)) {
      throw new Error('Ruta de adjunto inválida.');
    }
    return target;
  }
}
