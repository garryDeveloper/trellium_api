import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
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

interface DeleteChecklistItemCommand {
  itemId: string;
  currentUserId: string;
}

@Injectable()
export class DeleteChecklistItemUseCase implements UseCase<
  DeleteChecklistItemCommand,
  void
> {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: DeleteChecklistItemCommand): Promise<void> {
    const boardId = await this.checklists.findBoardIdByItem(command.itemId);
    if (!boardId) {
      throw new ChecklistItemNotFoundError();
    }

    const isMember = await this.boards.isMember(boardId, command.currentUserId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    await this.checklists.deleteItem(command.itemId);
  }
}
