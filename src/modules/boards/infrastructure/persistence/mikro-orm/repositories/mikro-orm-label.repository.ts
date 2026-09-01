import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Label } from '../../../../domain/entities/label.entity';
import { LabelRepository } from '../../../../domain/ports/label.repository';
import { LabelMikroEntity } from '../entities/label.mikro-entity';
import { LabelMapper } from '../mappers/label.mapper';

@Injectable()
export class MikroOrmLabelRepository implements LabelRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(labelId: string): Promise<Label | null> {
    const row = await this.em.findOne(LabelMikroEntity, { id: labelId });

    return row ? LabelMapper.toDomain(row) : null;
  }

  async findByBoard(boardId: string): Promise<Label[]> {
    const rows = await this.em.find(
      LabelMikroEntity,
      { board: boardId },
      { orderBy: { createdAt: 'asc' } },
    );

    return rows.map((row) => LabelMapper.toDomain(row));
  }

  async create(label: Label): Promise<Label> {
    const row = this.em.create(
      LabelMikroEntity,
      LabelMapper.toPersistence(label),
    );
    await this.em.persist(row).flush();
    return LabelMapper.toDomain(row);
  }

  async update(label: Label): Promise<Label> {
    const ref = this.em.getReference(LabelMikroEntity, label.id);
    this.em.assign(ref, LabelMapper.toPersistence(label));
    await this.em.flush();
    return label;
  }

  async delete(labelId: string): Promise<void> {
    await this.em.nativeDelete(LabelMikroEntity, { id: labelId });
  }
}
