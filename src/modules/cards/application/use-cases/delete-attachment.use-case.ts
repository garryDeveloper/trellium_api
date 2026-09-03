import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentNotFoundError } from '../../domain/errors/attachment-not-found.error';
import { UserNotAuthorizedDeleteAttachmentError } from '../../domain/errors/not-authorized-delete-attachment.error';
import {
  ATTACHMENT_REPOSITORY,
  type AttachmentRepository,
} from '../../domain/ports/attachment.repository';
import {
  ATTACHMENT_STORAGE,
  type AttachmentStorage,
} from '../../domain/ports/attachment-storage.port';

interface DeleteAttachmentCommand {
  attachmentId: string;
  currentUserId: string;
}

@Injectable()
export class DeleteAttachmentUseCase implements UseCase<
  DeleteAttachmentCommand,
  Attachment
> {
  constructor(
    @Inject(ATTACHMENT_REPOSITORY)
    private readonly attachments: AttachmentRepository,
    @Inject(ATTACHMENT_STORAGE) private readonly storage: AttachmentStorage,
  ) {}

  async execute(command: DeleteAttachmentCommand): Promise<Attachment> {
    const context = await this.attachments.findAuthorizationContext(
      command.attachmentId,
      command.currentUserId,
    );
    if (!context) {
      throw new AttachmentNotFoundError();
    }

    const isBoardOwner = context.boardOwnerId === command.currentUserId;
    const isUploader = context.attachment.uploaderId === command.currentUserId;

    // El dueño del tablero modera adjuntos ajenos; quien lo subió solo puede
    // borrar el suyo mientras siga siendo miembro (`domain.md`, regla 10).
    if (!isBoardOwner && !(isUploader && context.isCurrentUserMember)) {
      throw new UserNotAuthorizedDeleteAttachmentError();
    }

    await this.attachments.deleteAttachment(command.attachmentId);
    // La fila manda: si el archivo ya no está en disco, el borrado igual quedó
    // hecho, así que el storage traga el ENOENT.
    await this.storage.delete(context.attachment.storageKey);

    return context.attachment;
  }
}
