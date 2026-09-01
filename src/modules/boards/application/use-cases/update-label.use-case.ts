import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/application/use-case.interface';
import { Label } from '../../domain/entities/label.entity';
import { BOARD_REPOSITORY } from '../../domain/ports/board.repository';
import type { BoardRepository } from '../../domain/ports/board.repository';
import { LABEL_REPOSITORY } from '../../domain/ports/label.repository';
import type { LabelRepository } from '../../domain/ports/label.repository';
import { NotBoardMemberError } from '../../domain/errors/not-board-member.error';
import { LabelNotFoundError } from '../../domain/errors/label-not-found.error';

export interface UpdateLabelCommand {
  labelId: string;
  name?: string;
  color?: string;
  userId: string;
}

@Injectable()
export class UpdateLabelUseCase implements UseCase<UpdateLabelCommand, Label> {
  constructor(
    @Inject(BOARD_REPOSITORY) private readonly boards: BoardRepository,
    @Inject(LABEL_REPOSITORY) private readonly labels: LabelRepository,
  ) {}

  async execute(command: UpdateLabelCommand): Promise<Label> {
    const label = await this.labels.findById(command.labelId);
    if (!label) {
      throw new LabelNotFoundError();
    }

    const isMember = await this.boards.isMember(label.boardId, command.userId);
    if (!isMember) {
      throw new NotBoardMemberError();
    }

    const updated = label.update({
      name: command.name,
      color: command.color,
    });

    return await this.labels.update(updated);
  }
}
