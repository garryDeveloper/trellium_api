import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  ACTIVITY_RECORDER,
  type ActivityRecorderPort,
} from 'src/shared/application/ports/activity-recorder.port';
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
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';

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
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(ACTIVITY_RECORDER)
    private readonly activities: ActivityRecorderPort,
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

    // El título se lee antes de borrar nada: el adjunto ya no va a estar, pero
    // el evento tiene que decir de qué tarjeta era.
    const card = await this.cards.findById(context.attachment.cardId);

    await this.attachments.deleteAttachment(command.attachmentId);
    // La fila manda: si el archivo ya no está en disco, el borrado igual quedó
    // hecho, así que el storage traga el ENOENT.
    await this.storage.delete(context.attachment.storageKey);

    await this.activities.record([
      {
        boardId: context.boardId,
        cardId: context.attachment.cardId,
        actorUserId: command.currentUserId,
        detail: {
          type: 'attachment_removed',
          cardTitle: card?.title ?? '',
          fileName: context.attachment.filename,
        },
      },
    ]);

    return context.attachment;
  }
}
