import { randomUUID } from 'crypto';
import { Entity } from 'src/shared/domain/entity.base';

export interface AttachmentProps {
  id: string;
  cardId: string;
  uploaderId: string;
  /** Nombre que tenía el archivo en la máquina de quien lo subió; solo se muestra. */
  filename: string;
  /** Ruta relativa dentro del almacenamiento; la genera el sistema, nunca el cliente. */
  storageKey: string;
  mimeType: string;
  /** Bytes. */
  size: number;
  createdAt: Date;
}

export class Attachment extends Entity<string> {
  private constructor(private readonly props: AttachmentProps) {
    super(props.id);
  }

  static create(props: {
    cardId: string;
    uploaderId: string;
    filename: string;
    storageKey: string;
    mimeType: string;
    size: number;
  }): Attachment {
    return new Attachment({
      id: randomUUID(),
      cardId: props.cardId,
      uploaderId: props.uploaderId,
      filename: props.filename,
      storageKey: props.storageKey,
      mimeType: props.mimeType,
      size: props.size,
      createdAt: new Date(),
    });
  }

  static fromPersistence(props: AttachmentProps): Attachment {
    return new Attachment(props);
  }

  get cardId(): string {
    return this.props.cardId;
  }

  get uploaderId(): string {
    return this.props.uploaderId;
  }

  get filename(): string {
    return this.props.filename;
  }

  get storageKey(): string {
    return this.props.storageKey;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get size(): number {
    return this.props.size;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
