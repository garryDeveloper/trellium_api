import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { UserMikroEntity } from 'src/modules/iam/infrastructure/persistence/mikro-orm/entities/user.mikro-entity';
import { CardMikroEntity } from './card.mikro-entity';

export const AttachmentMikroEntity = defineEntity({
  name: 'Attachment',
  tableName: 'attachments',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    filename: p.string(),
    storageKey: p.string().fieldName('storage_key'),
    mimeType: p.string().fieldName('mime_type'),
    size: p.integer(),
    card: p
      .manyToOne(CardMikroEntity)
      .fieldName('card_id')
      .deleteRule('cascade'),
    uploader: p
      .manyToOne(UserMikroEntity)
      .fieldName('uploader_id')
      .deleteRule('cascade'),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
  },
});

export type AttachmentMikroEntity = InferEntity<typeof AttachmentMikroEntity>;
