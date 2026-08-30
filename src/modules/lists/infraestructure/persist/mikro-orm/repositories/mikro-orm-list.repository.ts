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
}