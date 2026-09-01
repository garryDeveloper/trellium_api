import { randomUUID } from 'crypto';
import { Entity } from '../../../../shared/domain/entity.base';

export const LABEL_COLOR_PALETTE = [
  '#B7E4C7', // verde
  '#FDE68A', // amarillo
  '#FCD3A2', // naranja
  '#FCA5A5', // rojo
  '#F5C2E7', // rosa
  '#DDD6FE', // morado
  '#BFDBFE', // azul
  '#D9D9D6', // gris
] as const;

export interface LabelProps {
  id: string;
  boardId: string;
  name: string;
  color: string;
  createdAt: Date;
}

export class Label extends Entity<string> {
  private constructor(private readonly props: LabelProps) {
    super(props.id);
  }

  static create(props: {
    boardId: string;
    name: string;
    color: string;
  }): Label {
    return new Label({
      id: randomUUID(),
      boardId: props.boardId,
      name: props.name,
      color: props.color,
      createdAt: new Date(),
    });
  }

  static fromPersistence(props: LabelProps): Label {
    return new Label(props);
  }

  update(props: { name?: string; color?: string }): Label {
    return new Label({
      ...this.props,
      name: props.name ?? this.props.name,
      color: props.color ?? this.props.color,
    });
  }

  get boardId(): string {
    return this.props.boardId;
  }

  get name(): string {
    return this.props.name;
  }

  get color(): string {
    return this.props.color;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
