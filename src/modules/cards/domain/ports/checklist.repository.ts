import { Checklist } from '../entities/checklist.entity';
import { ChecklistItem } from '../entities/checklist-item.entity';

export interface ChecklistWithItems {
  checklist: Checklist;
  items: ChecklistItem[];
}

/** Progreso derivado de los ítems (`domain.md`, regla 8): nunca se persiste. */
export interface ChecklistProgress {
  completed: number;
  total: number;
}

export interface ChecklistRepository {
  createChecklist(checklist: Checklist): Promise<Checklist>;
  findById(checklistId: string): Promise<Checklist | null>;
  /**
   * Las checklists de una tarjeta con sus ítems ya resueltos. Devolver el
   * agregado armado es deliberado: si el caso de uso pidiera los ítems checklist
   * por checklist, listar una tarjeta con N checklists costaría N+1 queries.
   */
  findByCardWithItems(cardId: string): Promise<ChecklistWithItems[]>;
  deleteChecklist(checklistId: string): Promise<void>;

  createItem(item: ChecklistItem): Promise<ChecklistItem>;
  findItemById(itemId: string): Promise<ChecklistItem | null>;
  updateItem(item: ChecklistItem): Promise<ChecklistItem>;
  deleteItem(itemId: string): Promise<void>;
  getNextItemPosition(checklistId: string): Promise<number>;

  /**
   * Progreso de todas las checklists de cada tarjeta, agrupado por `cardId`.
   * Recibe las tarjetas juntas para que listar una lista sea una query y no N.
   * Una tarjeta sin checklists no aparece en el mapa.
   */
  findProgressByCards(
    cardIds: string[],
  ): Promise<Map<string, ChecklistProgress>>;

  /**
   * Resuelve el tablero dueño de una checklist / de un ítem en una sola query.
   * Autorizar recorriendo checklist -> tarjeta -> lista -> tablero costaría
   * tres round-trips por request; el join los colapsa en uno.
   * Devuelve `null` si la checklist o el ítem no existen.
   */
  findBoardIdByChecklist(checklistId: string): Promise<string | null>;
  findBoardIdByItem(itemId: string): Promise<string | null>;
}

export const CHECKLIST_REPOSITORY = Symbol('CHECKLIST_REPOSITORY');
