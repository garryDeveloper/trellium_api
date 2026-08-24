import { randomUUID } from 'crypto';
import { Entity } from '../../../../shared/domain/entity.base';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<string> {
  private constructor(private readonly props: UserProps) {
    super(props.id);
  }

  static create(props: {
    name: string;
    email: string;
    passwordHash: string;
  }): User {
    const now = new Date();
    return new User({
      id: randomUUID(),
      name: props.name,
      email: props.email,
      passwordHash: props.passwordHash,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  rename(name: string): User {
    return new User({ ...this.props, name, updatedAt: new Date() });
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
