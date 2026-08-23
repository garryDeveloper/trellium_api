import { User } from '../../../../domain/entities/user.entity';
import { UserMikroEntity } from '../entities/user.mikro-entity';

export class UserMapper {
  static toDomain(entity: UserMikroEntity): User {
    return User.fromPersistence({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
