import { AttachmentWithUploader } from '../../../domain/ports/attachment.repository';
import { AttachmentResponseDto } from '../dto/attachment.response.dto';

export class AttachmentResponseMapper {
  static toResponseDto({
    attachment,
    uploader,
  }: AttachmentWithUploader): AttachmentResponseDto {
    return {
      id: attachment.id,
      cardId: attachment.cardId,
      filename: attachment.filename,
      mimeType: attachment.mimeType,
      size: attachment.size,
      uploadedBy: {
        id: uploader.id,
        name: uploader.name,
        email: uploader.email,
      },
      createdAt: attachment.createdAt.toISOString(),
    };
  }
}
