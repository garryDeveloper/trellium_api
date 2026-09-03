import { Attachment } from 'src/modules/cards/domain/entities/attachment.entity';
import { AttachmentWithUploader } from 'src/modules/cards/domain/ports/attachment.repository';
import { AttachmentMikroEntity } from '../entities/attachment.mikro-entity';

export class AttachmentMapper {
  static toDomain(entity: AttachmentMikroEntity): Attachment {
    return Attachment.fromPersistence({
      id: entity.id,
      cardId: entity.card.id,
      uploaderId: entity.uploader.id,
      filename: entity.filename,
      storageKey: entity.storageKey,
      mimeType: entity.mimeType,
      size: entity.size,
      createdAt: entity.createdAt,
    });
  }

  /** Requiere que la relación `uploader` venga poblada. */
  static toDomainWithUploader(
    entity: AttachmentMikroEntity,
  ): AttachmentWithUploader {
    return {
      attachment: this.toDomain(entity),
      uploader: {
        id: entity.uploader.id,
        name: entity.uploader.name,
        email: entity.uploader.email,
      },
    };
  }

  static toPersistence(attachment: Attachment) {
    return {
      id: attachment.id,
      filename: attachment.filename,
      storageKey: attachment.storageKey,
      mimeType: attachment.mimeType,
      size: attachment.size,
      card: attachment.cardId,
      uploader: attachment.uploaderId,
      createdAt: attachment.createdAt,
    };
  }
}
