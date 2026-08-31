import { List } from "../entities/list.entity";

export interface ListRepository {
    createList(list: List): Promise<List>;
    getNextPosition(boardId: string): Promise<number>;
    findById(listId: string): Promise<List | null>;
    findByBoardAndStatus(boardId: string, status: 'active' | 'archived'): Promise<List[]>;
    countByBoard(boardId: string): Promise<number>;
    update(list: List): Promise<List>;
    shiftPositions(boardId: string, fromPosition: number, toPosition: number): Promise<void>;
    deleteList(listId: string): Promise<void>;
}

export const LIST_REPOSITORY = Symbol('LIST_REPOSITORY');