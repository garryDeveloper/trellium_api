import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../../domain/entities/user.entity';
import { UserRepository } from '../../../../domain/ports/user.repository';
import { UserMikroEntity } from '../entities/user.mikro-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class MikroOrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.em.findOne(UserMikroEntity, { email });
    return row ? UserMapper.toDomain(row) : null;
  }
}
