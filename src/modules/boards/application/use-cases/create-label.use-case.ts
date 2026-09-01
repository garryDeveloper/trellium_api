import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Label } from '../../domain/entities/label.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { LABEL_REPOSITORY } from '../../domain/ports/label.repository';
import type { LabelRepository } from '../../domain/ports/label.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';

export interface CreateLabelCommand {
  boardId: string;
  name: string;
  color: string;
  userId: string;
}

@Injectable()
export class CreateLabelUseCase implements UseCase<CreateLabelCommand, Label> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(LABEL_REPOSITORY) private readonly labels: LabelRepository,
  ) {}

  async execute(command: CreateLabelCommand): Promise<Label> {
    const isMember = await this.boards.isMember(
      command.boardId,
      command.userId,
    );
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const label = Label.create({
      boardId: command.boardId,
      name: command.name,
      color: command.color,
    });

    return await this.labels.create(label);
  }
}
