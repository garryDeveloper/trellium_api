import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';
import { ListNotFoundError } from 'src/modules/lists/domain/errors/list-not-found.error';
import {
  LIST_REPOSITORY,
  type ListRepository,
} from 'src/modules/lists/domain/ports/list.repository';
import { Attachment } from '../../domain/entities/attachment.entity';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import { AttachmentTooLargeError } from '../../domain/errors/attachment-too-large.error';
import { EmptyAttachmentError } from '../../domain/errors/empty-attachment.error';
import { UnsupportedAttachmentTypeError } from '../../domain/errors/unsupported-attachment-type.error';
import {
  ALLOWED_ATTACHMENT_LABEL,
  MAX_ATTACHMENT_BYTES,
  extensionForType,
  isAllowedAttachmentType,
} from '../../domain/attachment-policy';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import {
  ATTACHMENT_REPOSITORY,
  type AttachmentRepository,
  type AttachmentWithUploader,
} from '../../domain/ports/attachment.repository';
import {
  ATTACHMENT_STORAGE,
  type AttachmentStorage,
} from '../../domain/ports/attachment-storage.port';

interface CreateAttachmentCommand {
  cardId: string;
  currentUserId: string;
  filename: string;
  mimeType: string;
  content: Buffer;
}

@Injectable()
export class CreateAttachmentUseCase implements UseCase<
  CreateAttachmentCommand,
  AttachmentWithUploader
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(ATTACHMENT_REPOSITORY)
    private readonly attachments: AttachmentRepository,
    @Inject(ATTACHMENT_STORAGE) private readonly storage: AttachmentStorage,
    @Inject(LIST_REPOSITORY) private readonly lists: ListRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(
    command: CreateAttachmentCommand,
  ): Promise<AttachmentWithUploader> {
    // La autorización va antes de tocar el disco: un no-miembro no debe poder
    // dejar bytes en el servidor ni siquiera de forma temporal.
    const card = await this.cards.findById(command.cardId);
    if (!card) {
      throw new CardNotFoundError();
    }

    const list = await this.lists.findById(card.listId);
    if (!list) {
      throw new ListNotFoundError();
    }

    const isMember = await this.boards.isMember(
      list.boardId,
      command.currentUserId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    if (command.content.length === 0) {
      throw new EmptyAttachmentError();
    }

    if (command.content.length > MAX_ATTACHMENT_BYTES) {
      throw new AttachmentTooLargeError(MAX_ATTACHMENT_BYTES);
    }

    if (!isAllowedAttachmentType(command.mimeType)) {
      throw new UnsupportedAttachmentTypeError(
        command.mimeType,
        ALLOWED_ATTACHMENT_LABEL,
      );
    }

    const stored = await this.storage.save({
      cardId: command.cardId,
      extension: extensionForType(command.mimeType),
      content: command.content,
    });

    const attachment = Attachment.create({
      cardId: command.cardId,
      uploaderId: command.currentUserId,
      filename: command.filename,
      storageKey: stored.storageKey,
      mimeType: command.mimeType,
      size: command.content.length,
    });

    try {
      return await this.attachments.createAttachment(attachment);
    } catch (error) {
      // Si la fila no se pudo insertar, el archivo en disco quedaría huérfano.
      await this.storage.delete(stored.storageKey);
      throw error;
    }
  }
}
