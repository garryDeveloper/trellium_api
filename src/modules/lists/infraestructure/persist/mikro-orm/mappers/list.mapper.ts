import { List } from "src/modules/lists/domain/entities/list.entity";
import { ListMikroEntity } from "../entities/list.mikro-entity";

export class ListMapper {
    static toDomain(entity: ListMikroEntity): List {
        return List.fromPersistence({
            id: entity.id,
            name: entity.name,
            boardId: entity.board.id,
            status: entity.status,
            position: entity.position,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toPersistence(list: List) {
        return {
            id: list.id,
            name: list.name,
            board: list.boardId,
            status: list.status,
            position: list.position,
            createdAt: list.createdAt,
            updatedAt: list.updatedAt,
        };
    }
}