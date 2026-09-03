import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { ChecklistItem } from '../../domain/entities/checklist-item.entity';
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

interface AddChecklistItemCommand {
  checklistId: string;
  text: string;
  currentUserId: string;
}

@Injectable()
export class AddChecklistItemUseCase implements UseCase<
  AddChecklistItemCommand,
  ChecklistItem
> {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: AddChecklistItemCommand): Promise<ChecklistItem> {
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

    const nextPosition = await this.checklists.getNextItemPosition(
      command.checklistId,
    );

    const item = ChecklistItem.create({
      checklistId: command.checklistId,
      text: command.text,
      position: nextPosition,
    });

    return this.checklists.createItem(item);
  }
}
