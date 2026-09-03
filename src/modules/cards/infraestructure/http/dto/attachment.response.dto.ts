import { ApiProperty } from '@nestjs/swagger';

export class AttachmentUploaderDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;
}

export class AttachmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  cardId!: string;

  @ApiProperty({ description: 'Nombre original del archivo.' })
  filename!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty({ description: 'Tamaño en bytes.' })
  size!: number;

  @ApiProperty({ type: AttachmentUploaderDto })
  uploadedBy!: AttachmentUploaderDto;

  @ApiProperty()
  createdAt!: string;
}

export class ListAttachmentsResponseDto {
  @ApiProperty({ type: [AttachmentResponseDto] })
  attachments!: AttachmentResponseDto[];
}
