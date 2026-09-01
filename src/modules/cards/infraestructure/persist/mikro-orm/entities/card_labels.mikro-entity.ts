import { defineEntity, p } from '@mikro-orm/core';
import type { InferEntity } from '@mikro-orm/core';
import { LabelMikroEntity } from 'src/modules/boards/infrastructure/persistence/mikro-orm/entities/label.mikro-entity';
import { CardMikroEntity } from './card.mikro-entity';

export const CardLabelMikroEntity = defineEntity({
  name: 'CardLabel',
  tableName: 'card_labels',
  properties: {
    card: p
      .manyToOne(CardMikroEntity)
      .primary()
      .fieldName('card_id')
      .deleteRule('cascade'),
    label: p
      .manyToOne(LabelMikroEntity)
      .primary()
      .fieldName('label_id')
      .deleteRule('cascade'),
  },
});

export type CardLabelMikroEntity = InferEntity<typeof CardLabelMikroEntity>;
