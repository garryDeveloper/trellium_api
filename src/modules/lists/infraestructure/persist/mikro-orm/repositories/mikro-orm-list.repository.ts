import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ListRepository } from "src/modules/lists/domain/ports/list.repository";
import { ListMikroEntity } from "../entities/list.mikro-entity";
import { List } from "src/modules/lists/domain/entities/list.entity";
import { ListMapper } from "../mappers/list.mapper";

@Injectable()
export class MikroOrmListRepository implements ListRepository {
  constructor(private readonly em: EntityManager) {}

  async createList(list: List): Promise<List> {
    const listEntity = this.em.create(ListMikroEntity, ListMapper.toPersistence(list));
    await this.em.persist(listEntity).flush();
    return ListMapper.toDomain(listEntity);
  }
  async getNextPosition(boardId: string): Promise<number> {
    const [row] = await this.em.getConnection().execute<
      { maxPosition: number | null }[]
    >(`select max(position) as "maxPosition" from lists where board_id = ?`, [
      boardId,
    ]);

    return (row?.maxPosition ?? 0) + 1;
  }

  async findById(listId: string): Promise<List | null> {
    const entity = await this.em.findOne(ListMikroEntity, { id: listId });
    return entity ? ListMapper.toDomain(entity) : null;
  }

  async findByBoardAndStatus(
    boardId: string,
    status: 'active' | 'archived',
  ): Promise<List[]> {
    const entities = await this.em.find(
      ListMikroEntity,
      { board: boardId, status },
      {
        orderBy:
          status === 'archived'
            ? { archivedAt: 'desc' }
            : { position: 'asc' },
      },
    );
    return entities.map((entity) => ListMapper.toDomain(entity));
  }

  async countByBoard(boardId: string): Promise<number> {
    return this.em.count(ListMikroEntity, { board: boardId });
  }

  async update(list: List): Promise<List> {
    const ref = this.em.getReference(ListMikroEntity, list.id);
    this.em.assign(ref, ListMapper.toPersistence(list));
    await this.em.flush();
    return list;
  }

  async shiftPositions(
    boardId: string,
    fromPosition: number,
    toPosition: number,
  ): Promise<void> {
    if (toPosition === fromPosition) return;

    if (toPosition > fromPosition) {
      await this.em.getConnection().execute(
        `update lists set position = position - 1 where board_id = ? and position > ? and position <= ?`,
        [boardId, fromPosition, toPosition],
      );
    } else {
      await this.em.getConnection().execute(
        `update lists set position = position + 1 where board_id = ? and position >= ? and position < ?`,
        [boardId, toPosition, fromPosition],
      );
    }
  }

  async deleteList(listId: string): Promise<void> {
    await this.em.nativeDelete(ListMikroEntity, { id: listId });
  }
}