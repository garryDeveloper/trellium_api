import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Checklist } from '../../domain/entities/checklist.entity';
import {
  CARD_REPOSITORY,
  type CardRepository,
} from '../../domain/ports/card.repository';
import {
  CHECKLIST_REPOSITORY,
  type ChecklistRepository,
} from '../../domain/ports/checklist.repository';
import { CardNotFoundError } from '../../domain/errors/card-not-found.error';
import {
  BOARD_REPOSITORY,
  type BoardRepository,
} from 'src/modules/boards/domain/ports/board.repository';
import { NotBoardMemberError } from 'src/modules/boards/domain/errors/not-board-member.error';

interface CreateChecklistCommand {
  cardId: string;
  name: string;
  currentUserId: string;
}

@Injectable()
export class CreateChecklistUseCase implements UseCase<
  CreateChecklistCommand,
  Checklist
> {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cards: CardRepository,
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepository,
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
  ) {}

  async execute(command: CreateChecklistCommand): Promise<Checklist> {
    const boardId = await this.cards.findBoardIdByCard(command.cardId);
    if (!boardId) {
      throw new CardNotFoundError();
    }

    const isMember = await this.boards.isMember(boardId, command.currentUserId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const checklist = Checklist.create({
      cardId: command.cardId,
      name: command.name,
    });

    return this.checklists.createChecklist(checklist);
  }
}
