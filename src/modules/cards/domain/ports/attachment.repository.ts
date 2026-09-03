import { Attachment } from '../entities/attachment.entity';

export interface AttachmentUploaderInfo {
  id: string;
  name: string;
  email: string;
}

/**
 * Adjunto junto con los datos públicos de quien lo subió. El agregado solo
 * guarda `uploaderId`; la capa HTTP necesita además nombre y email, y
 * resolverlos adjunto por adjunto costaría N+1 queries al listar.
 */
export interface AttachmentWithUploader {
  attachment: Attachment;
  uploader: AttachmentUploaderInfo;
}

export interface AttachmentAuthorizationContext {
  attachment: Attachment;
  boardId: string;
  boardOwnerId: string;
  isCurrentUserMember: boolean;
}

export interface AttachmentRepository {
  createAttachment(attachment: Attachment): Promise<AttachmentWithUploader>;
  findAttachmentsByCard(cardId: string): Promise<AttachmentWithUploader[]>;
  /**
   * Resuelve el adjunto + dueño del tablero + membresía en una sola query,
   * igual que en comentarios: recorrer adjunto -> tarjeta -> lista -> tablero y
   * luego consultar `board_members` costaría cuatro round-trips.
   */
  findAuthorizationContext(
    attachmentId: string,
    userId: string,
  ): Promise<AttachmentAuthorizationContext | null>;
  deleteAttachment(attachmentId: string): Promise<void>;
}

export const ATTACHMENT_REPOSITORY = Symbol('ATTACHMENT_REPOSITORY');
