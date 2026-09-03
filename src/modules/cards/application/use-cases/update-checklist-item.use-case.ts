import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { ChecklistItem } from '../../domain/entities/checklist-item.entity';
import {
  CHECKLIST_REPOSITORY,
  type ChecklistRepository,
} from '../../domain/ports/checklist.repository';
import { ChecklistItemNotFoundError } from '../../domain/errors/checklist-item-not-found.error';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface UpdateChecklistItemCommand {
  itemId: string;
  text?: string;
  completed?: boolean;
  currentUserId: string;
}

/**
 * Marca / desmarca un ítem y, según `endpoints.md`, también permite corregir su
 * texto (T7.2). Cualquier miembro del tablero puede hacerlo.
 */
@Injectable()
export class UpdateChecklistItemUseCase implements UseCase<
  UpdateChecklistItemCommand,
  ChecklistItem
> {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: UpdateChecklistItemCommand): Promise<ChecklistItem> {
    const boardId = await this.checklists.findBoardIdByItem(command.itemId);
    if (!boardId) {
      throw new ChecklistItemNotFoundError();
    }

    const isMember = await this.boards.isMember(boardId, command.currentUserId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const item = await this.checklists.findItemById(command.itemId);
    if (!item) {
      throw new ChecklistItemNotFoundError();
    }

    let updated = item;
    if (command.text !== undefined) {
      updated = updated.updateText(command.text);
    }
    if (command.completed !== undefined) {
      updated = updated.setCompleted(command.completed);
    }

    if (updated === item) {
      return item;
    }

    return this.checklists.updateItem(updated);
  }
}
