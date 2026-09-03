import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import {
  CHECKLIST_REPOSITORY,
  type ChecklistRepository,
} from '../../domain/ports/checklist.repository';
import { ChecklistNotFoundError } from '../../domain/errors/checklist-not-found.error';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface DeleteChecklistCommand {
  checklistId: string;
  currentUserId: string;
}

/**
 * Los ítems caen por la FK `on delete cascade` de `checklist_items` (T7.3), no
 * hace falta borrarlos a mano.
 */
@Injectable()
export class DeleteChecklistUseCase implements UseCase<
  DeleteChecklistCommand,
  void
> {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: DeleteChecklistCommand): Promise<void> {
    const boardId = await this.checklists.findBoardIdByChecklist(
      command.checklistId,
    );
    if (!boardId) {
      throw new ChecklistNotFoundError();
    }

    const isMember = await this.boards.isMember(boardId, command.currentUserId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    await this.checklists.deleteChecklist(command.checklistId);
  }
}
