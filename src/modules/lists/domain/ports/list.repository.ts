import { List } from "../entities/list.entity";

export interface ListRepository { 
    createList(list: List): Promise<List>;
    getNextPosition(boardId: string): Promise<number>;
}

export const LIST_REPOSITORY = Symbol('LIST_REPOSITORY');