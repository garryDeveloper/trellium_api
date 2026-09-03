import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Checklist } from 'src/modules/cards/domain/entities/checklist.entity';
import { ChecklistItem } from 'src/modules/cards/domain/entities/checklist-item.entity';
import {
  ChecklistProgress,
  ChecklistRepository,
  ChecklistWithItems,
} from 'src/modules/cards/domain/ports/checklist.repository';
import { ChecklistMikroEntity } from '../entities/checklist.mikro-entity';
import { ChecklistItemMikroEntity } from '../entities/checklist-item.mikro-entity';
import { ChecklistMapper } from '../mappers/checklist.mapper';

@Injectable()
export class MikroOrmChecklistRepository implements ChecklistRepository {
  constructor(private readonly em: EntityManager) {}

  async createChecklist(checklist: Checklist): Promise<Checklist> {
    const row = this.em.create(
      ChecklistMikroEntity,
      ChecklistMapper.toPersistence(checklist),
    );
    await this.em.persist(row).flush();
    return ChecklistMapper.toDomain(row);
  }

  async findById(checklistId: string): Promise<Checklist | null> {
    const row = await this.em.findOne(ChecklistMikroEntity, {
      id: checklistId,
    });

    return row ? ChecklistMapper.toDomain(row) : null;
  }

  async findByCardWithItems(cardId: string): Promise<ChecklistWithItems[]> {
    const checklistRows = await this.em.find(
      ChecklistMikroEntity,
      { card: cardId },
      { orderBy: { createdAt: 'asc' } },
    );

    if (checklistRows.length === 0) {
      return [];
    }

    // Una sola query para todos los ítems: el filtro por `checklist.card`
    // joinea contra `checklists`, así que el costo no crece con la cantidad de
    // checklists de la tarjeta.
    const itemRows = await this.em.find(
      ChecklistItemMikroEntity,
      { checklist: { card: cardId } },
      { orderBy: { position: 'asc' } },
    );

    const itemsByChecklist = new Map<string, ChecklistItem[]>();
    for (const row of itemRows) {
      const items = itemsByChecklist.get(row.checklist.id) ?? [];
      items.push(ChecklistMapper.itemToDomain(row));
      itemsByChecklist.set(row.checklist.id, items);
    }

    return checklistRows.map((row) => ({
      checklist: ChecklistMapper.toDomain(row),
      items: itemsByChecklist.get(row.id) ?? [],
    }));
  }

  async deleteChecklist(checklistId: string): Promise<void> {
    await this.em.nativeDelete(ChecklistMikroEntity, { id: checklistId });
  }

  async createItem(item: ChecklistItem): Promise<ChecklistItem> {
    const row = this.em.create(
      ChecklistItemMikroEntity,
      ChecklistMapper.itemToPersistence(item),
    );
    await this.em.persist(row).flush();
    return ChecklistMapper.itemToDomain(row);
  }

  async findItemById(itemId: string): Promise<ChecklistItem | null> {
    const row = await this.em.findOne(ChecklistItemMikroEntity, { id: itemId });

    return row ? ChecklistMapper.itemToDomain(row) : null;
  }

  async updateItem(item: ChecklistItem): Promise<ChecklistItem> {
    const ref = this.em.getReference(ChecklistItemMikroEntity, item.id);
    this.em.assign(ref, ChecklistMapper.itemToPersistence(item));
    await this.em.flush();
    return item;
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.em.nativeDelete(ChecklistItemMikroEntity, { id: itemId });
  }

  async findProgressByCards(
    cardIds: string[],
  ): Promise<Map<string, ChecklistProgress>> {
    const progress = new Map<string, ChecklistProgress>();
    if (cardIds.length === 0) {
      return progress;
    }

    // Agregado en la base: traer los ítems para contarlos en memoria sería
    // gratuito ahora y caro con tarjetas grandes.
    const placeholders = cardIds.map(() => '?').join(', ');
    const rows = await this.em
      .getConnection()
      .execute<{ cardId: string; completed: string; total: string }[]>(
        `select ch.card_id as "cardId",
              count(*) filter (where ci.completed) as "completed",
              count(*) as "total"
         from checklists ch
         join checklist_items ci on ci.checklist_id = ch.id
        where ch.card_id in (${placeholders})
        group by ch.card_id`,
        cardIds,
      );

    for (const row of rows) {
      progress.set(row.cardId, {
        completed: Number(row.completed),
        total: Number(row.total),
      });
    }

    return progress;
  }

  async findBoardIdByChecklist(checklistId: string): Promise<string | null> {
    const [row] = await this.em.getConnection().execute<{ boardId: string }[]>(
      `select l.board_id as "boardId"
           from checklists ch
           join cards c on c.id = ch.card_id
           join lists l on l.id = c.list_id
          where ch.id = ?`,
      [checklistId],
    );

    return row?.boardId ?? null;
  }

  async findBoardIdByItem(itemId: string): Promise<string | null> {
    const [row] = await this.em.getConnection().execute<{ boardId: string }[]>(
      `select l.board_id as "boardId"
           from checklist_items ci
           join checklists ch on ch.id = ci.checklist_id
           join cards c on c.id = ch.card_id
           join lists l on l.id = c.list_id
          where ci.id = ?`,
      [itemId],
    );

    return row?.boardId ?? null;
  }

  async getNextItemPosition(checklistId: string): Promise<number> {
    const [row] = await this.em
      .getConnection()
      .execute<{ maxPosition: number | null }[]>(
        `select max(position) as "maxPosition" from checklist_items where checklist_id = ?`,
        [checklistId],
      );

    return (row?.maxPosition ?? 0) + 1;
  }
}
