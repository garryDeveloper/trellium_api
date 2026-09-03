import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Attachment } from 'src/modules/cards/domain/entities/attachment.entity';
import {
  AttachmentAuthorizationContext,
  AttachmentRepository,
  AttachmentWithUploader,
} from 'src/modules/cards/domain/ports/attachment.repository';
import { AttachmentMikroEntity } from '../entities/attachment.mikro-entity';
import { AttachmentMapper } from '../mappers/attachment.mapper';

@Injectable()
export class MikroOrmAttachmentRepository implements AttachmentRepository {
  constructor(private readonly em: EntityManager) {}

  async createAttachment(
    attachment: Attachment,
  ): Promise<AttachmentWithUploader> {
    const entity = this.em.create(
      AttachmentMikroEntity,
      AttachmentMapper.toPersistence(attachment),
    );
    await this.em.persist(entity).flush();
    // `uploader` se creó como referencia a partir del id: hay que cargarla para
    // devolver nombre y email.
    await this.em.populate(entity, ['uploader']);
    return AttachmentMapper.toDomainWithUploader(entity);
  }

  async findAttachmentsByCard(
    cardId: string,
  ): Promise<AttachmentWithUploader[]> {
    const rows = await this.em.find(
      AttachmentMikroEntity,
      { card: cardId },
      { populate: ['uploader'], orderBy: { createdAt: 'asc' } },
    );
    return rows.map((row) => AttachmentMapper.toDomainWithUploader(row));
  }

  // Mismo join que en comentarios: adjunto -> tarjeta -> lista -> tablero, más
  // un left join parametrizado a `board_members` para resolver la membresía.
  async findAuthorizationContext(
    attachmentId: string,
    userId: string,
  ): Promise<AttachmentAuthorizationContext | null> {
    const [row] = await this.em.getConnection().execute<
      {
        id: string;
        filename: string;
        storageKey: string;
        mimeType: string;
        size: number;
        cardId: string;
        uploaderId: string;
        createdAt: Date;
        boardId: string;
        boardOwnerId: string;
        isMember: boolean;
      }[]
    >(
      `select a.id, a.filename,
                    a.storage_key as "storageKey",
                    a.mime_type   as "mimeType",
                    a.size,
                    a.card_id     as "cardId",
                    a.uploader_id as "uploaderId",
                    a.created_at  as "createdAt",
                    b.id          as "boardId",
                    b.owner_id    as "boardOwnerId",
                    (bm.user_id is not null) as "isMember"
               from attachments a
               join cards ca on ca.id = a.card_id
               join lists l  on l.id  = ca.list_id
               join boards b on b.id  = l.board_id
               left join board_members bm
                      on bm.board_id = b.id and bm.user_id = ?
              where a.id = ?`,
      [userId, attachmentId],
    );

    if (!row) {
      return null;
    }

    return {
      attachment: Attachment.fromPersistence({
        id: row.id,
        cardId: row.cardId,
        uploaderId: row.uploaderId,
        filename: row.filename,
        storageKey: row.storageKey,
        mimeType: row.mimeType,
        size: Number(row.size),
        createdAt: row.createdAt,
      }),
      boardId: row.boardId,
      boardOwnerId: row.boardOwnerId,
      isCurrentUserMember: row.isMember,
    };
  }

  async deleteAttachment(attachmentId: string): Promise<void> {
    await this.em.nativeDelete(AttachmentMikroEntity, { id: attachmentId });
  }
}
