import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Board } from '../../../../domain/entities/board.entity';
import { BoardMember } from '../../../../domain/entities/board-member.entity';
import { BoardRepository } from '../../../../domain/ports/board.repository';
import { BoardMikroEntity } from '../entities/board.mikro-entity';
import { BoardMemberMikroEntity } from '../entities/board-member.mikro-entity';
import { BoardMapper } from '../mappers/board.mapper';

@Injectable()
export class MikroOrmBoardRepository implements BoardRepository {
  constructor(private readonly em: EntityManager) {}

  async create(board: Board): Promise<Board> {
    const row = this.em.create(
      BoardMikroEntity,
      BoardMapper.toPersistence(board),
    );
    await this.em.persist(row).flush();
    return BoardMapper.toDomain(row);
  }

  async addMember(member: BoardMember): Promise<BoardMember> {
    const row = this.em.create(
      BoardMemberMikroEntity,
      BoardMapper.memberToPersistence(member),
    );
    await this.em.persist(row).flush();
    return BoardMapper.memberToDomain(row);
  }
}
