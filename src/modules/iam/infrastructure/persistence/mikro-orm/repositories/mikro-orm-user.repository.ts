import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../../domain/entities/user.entity';
import { UserRepository } from '../../../../domain/ports/user.repository';
import { UserMikroEntity } from '../entities/user.mikro-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class MikroOrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}
  async create(user: User): Promise<User> {
    const row = this.em.create(UserMikroEntity, UserMapper.toPersistence(user));
    await this.em.persist(row).flush();
    return UserMapper.toDomain(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.em.findOne(UserMikroEntity, { email });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.em.findOne(UserMikroEntity, { id });
    return row ? UserMapper.toDomain(row) : null;
  }

  async update(user: User): Promise<User> {
    const row = await this.em.findOneOrFail(UserMikroEntity, {
      id: user.id,
    });
    this.em.assign(row, UserMapper.toPersistence(user));
    await this.em.flush();
    return UserMapper.toDomain(row);
  }
}
