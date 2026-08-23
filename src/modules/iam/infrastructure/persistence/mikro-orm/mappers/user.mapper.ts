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
}
