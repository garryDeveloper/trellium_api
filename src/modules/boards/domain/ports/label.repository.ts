import { Label } from '../entities/label.entity';

export interface LabelRepository {
  findById(labelId: string): Promise<Label | null>;
  findByBoard(boardId: string): Promise<Label[]>;
  create(label: Label): Promise<Label>;
  update(label: Label): Promise<Label>;
  delete(labelId: string): Promise<void>;
}

export const LABEL_REPOSITORY = Symbol('LABEL_REPOSITORY');
