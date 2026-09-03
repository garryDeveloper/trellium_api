import { randomUUID } from 'crypto';
import { Entity } from 'src/shared/domain/entity.base';

export interface ChecklistItemProps {
  id: string;
  checklistId: string;
  text: string;
  completed: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ChecklistItem extends Entity<string> {
  private constructor(private readonly props: ChecklistItemProps) {
    super(props.id);
  }

  /**
   * Un ítem recién creado siempre nace pendiente (T7.1): `completed` no es un
   * parámetro, se alterna después vía `toggle()` (T7.2).
   */
  static create(props: {
    checklistId: string;
    text: string;
    position: number;
  }): ChecklistItem {
    const now = new Date();
    return new ChecklistItem({
      id: randomUUID(),
      checklistId: props.checklistId,
      text: props.text,
      completed: false,
      position: props.position,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: ChecklistItemProps): ChecklistItem {
    return new ChecklistItem(props);
  }

  /**
   * Alterna Pendiente <-> Completado (T7.2). El progreso de la checklist se
   * deriva de estos flags, nunca se guarda (domain.md, regla 8).
   */
  toggle(): ChecklistItem {
    return new ChecklistItem({
      ...this.props,
      completed: !this.props.completed,
      updatedAt: new Date(),
    });
  }

  setCompleted(completed: boolean): ChecklistItem {
    if (completed === this.props.completed) {
      return this;
    }
    return this.toggle();
  }

  updateText(text: string): ChecklistItem {
    return new ChecklistItem({
      ...this.props,
      text,
      updatedAt: new Date(),
    });
  }

  get checklistId(): string {
    return this.props.checklistId;
  }

  get text(): string {
    return this.props.text;
  }

  get completed(): boolean {
    return this.props.completed;
  }

  get position(): number {
    return this.props.position;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
