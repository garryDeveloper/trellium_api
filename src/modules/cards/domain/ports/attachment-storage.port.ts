export interface StoredFile {
  /** Ruta relativa con la que después se recupera o borra el archivo. */
  storageKey: string;
}

/**
 * Guardar los bytes es un detalle de infraestructura: el caso de uso decide
 * *si* se puede subir, no *dónde* terminan. Cambiar disco local por un bucket
 * es reemplazar el adaptador.
 */
export interface AttachmentStorage {
  save(params: {
    cardId: string;
    extension: string;
    content: Buffer;
  }): Promise<StoredFile>;
  createReadStream(storageKey: string): NodeJS.ReadableStream;
  delete(storageKey: string): Promise<void>;
}

export const ATTACHMENT_STORAGE = Symbol('ATTACHMENT_STORAGE');
