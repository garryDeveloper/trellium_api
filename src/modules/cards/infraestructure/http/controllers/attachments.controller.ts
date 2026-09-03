import {
  Controller,
  Post,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  JwtAuthGuard,
  VerifiedTokenPayload,
} from 'src/modules/iam/infrastructure/http/guards/jwt-auth.guard';
import { CreateAttachmentUseCase } from '../../../application/use-cases/create-attachment.use-case';
import { DeleteAttachmentUseCase } from '../../../application/use-cases/delete-attachment.use-case';
import { GetAttachmentFileUseCase } from '../../../application/use-cases/get-attachment-file.use-case';
import { ListCardAttachmentsUseCase } from '../../../application/use-cases/list-card-attachments.use-case';
import { AttachmentTooLargeError } from '../../../domain/errors/attachment-too-large.error';
import { EmptyAttachmentError } from '../../../domain/errors/empty-attachment.error';
import { MAX_ATTACHMENT_BYTES } from '../../../domain/attachment-policy';
import {
  AttachmentResponseDto,
  ListAttachmentsResponseDto,
} from '../dto/attachment.response.dto';
import { AttachmentResponseMapper } from '../mappers/attachment.response.mapper';

@ApiTags('attachments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token inválido o expirado.' })
@UseGuards(JwtAuthGuard)
@Controller()
export class AttachmentsController {
  constructor(
    private readonly listAttachmentsUseCase: ListCardAttachmentsUseCase,
    private readonly createAttachmentUseCase: CreateAttachmentUseCase,
    private readonly getAttachmentFileUseCase: GetAttachmentFileUseCase,
    private readonly deleteAttachmentUseCase: DeleteAttachmentUseCase,
  ) {}

  @Get('cards/:cardId/attachments')
  @ApiOkResponse({ type: ListAttachmentsResponseDto })
  async listAttachments(
    @Param('cardId') cardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<ListAttachmentsResponseDto> {
    const attachments = await this.listAttachmentsUseCase.execute({
      cardId,
      currentUserId: req.user.sub,
    });

    return {
      attachments: attachments.map((attachment) =>
        AttachmentResponseMapper.toResponseDto(attachment),
      ),
    };
  }

  @Post('cards/:cardId/attachments')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiCreatedResponse({ type: AttachmentResponseDto })
  async uploadAttachment(
    @Param('cardId') cardId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<AttachmentResponseDto> {
    const file = await req.file();
    if (!file) {
      throw new EmptyAttachmentError();
    }

    const content = await this.readWithinLimit(file);

    const attachment = await this.createAttachmentUseCase.execute({
      cardId,
      currentUserId: req.user.sub,
      filename: file.filename,
      mimeType: file.mimetype,
      content,
    });

    return AttachmentResponseMapper.toResponseDto(attachment);
  }

  @Get('attachments/:attachmentId/download')
  async downloadAttachment(
    @Param('attachmentId') attachmentId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const { attachment, stream } = await this.getAttachmentFileUseCase.execute({
      attachmentId,
      currentUserId: req.user.sub,
    });

    // Siempre como descarga y sin sniffing: aunque la whitelist ya excluye los
    // tipos renderizables peligrosos, no hay motivo para servir inline.
    await reply
      .header('Content-Type', attachment.mimeType)
      .header('Content-Length', attachment.size)
      .header('X-Content-Type-Options', 'nosniff')
      .header(
        'Content-Disposition',
        `attachment; filename*=UTF-8''${encodeURIComponent(attachment.filename)}`,
      )
      .send(stream);
  }

  @Delete('attachments/:attachmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Adjunto eliminado.' })
  async deleteAttachment(
    @Param('attachmentId') attachmentId: string,
    @Req() req: FastifyRequest & { user: VerifiedTokenPayload },
  ): Promise<void> {
    await this.deleteAttachmentUseCase.execute({
      attachmentId,
      currentUserId: req.user.sub,
    });
  }

  /**
   * `@fastify/multipart` corta el stream en `fileSize` y marca `truncated`, o
   * tira `FST_REQ_FILE_TOO_LARGE` según la versión. Cualquiera de las dos se
   * traduce al mismo 413 del dominio, en vez de escaparse como 500.
   */
  private async readWithinLimit(file: {
    toBuffer: () => Promise<Buffer>;
    file: { truncated: boolean };
  }): Promise<Buffer> {
    try {
      const content = await file.toBuffer();
      if (file.file.truncated) {
        throw new AttachmentTooLargeError(MAX_ATTACHMENT_BYTES);
      }
      return content;
    } catch (error) {
      if (error instanceof AttachmentTooLargeError) {
        throw error;
      }
      if (isFileTooLargeError(error)) {
        throw new AttachmentTooLargeError(MAX_ATTACHMENT_BYTES);
      }
      throw error;
    }
  }
}

function isFileTooLargeError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error as Error & { code?: string }).code === 'FST_REQ_FILE_TOO_LARGE'
  );
}
