import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentNotFoundError } from '../../domain/errors/attachment-not-found.error';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';
import {
  ATTACHMENT_REPOSITORY,
  type AttachmentRepository,
} from '../../domain/ports/attachment.repository';
import {
  ATTACHMENT_STORAGE,
  type AttachmentStorage,
} from '../../domain/ports/attachment-storage.port';

interface GetAttachmentFileQuery {
  attachmentId: string;
  currentUserId: string;
}

export interface AttachmentFile {
  attachment: Attachment;
  stream: NodeJS.ReadableStream;
}

/**
 * Descargar pasa por acá y no por un directorio servido estático: la regla 2 de
 * `domain.md` dice que el contenido de un tablero no es accesible para quien no
 * es miembro, y una URL pública no podría comprobarlo.
 */
@Injectable()
export class GetAttachmentFileUseCase implements UseCase<
  GetAttachmentFileQuery,
  AttachmentFile
> {
  constructor(
    @Inject(ATTACHMENT_REPOSITORY)
    private readonly attachments: AttachmentRepository,
    @Inject(ATTACHMENT_STORAGE) private readonly storage: AttachmentStorage,
  ) {}

  async execute(query: GetAttachmentFileQuery): Promise<AttachmentFile> {
    const context = await this.attachments.findAuthorizationContext(
      query.attachmentId,
      query.currentUserId,
    );
    if (!context) {
      throw new AttachmentNotFoundError();
    }

    if (!context.isCurrentUserMember) {
      throw new NotBoardMemberError();
    }

    return {
      attachment: context.attachment,
      stream: this.storage.createReadStream(context.attachment.storageKey),
    };
  }
}
