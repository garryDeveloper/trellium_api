import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Board } from '../../../../domain/entities/board.entity';
import { BoardMember } from '../../../../domain/entities/board-member.entity';
import {
  BoardMembershipSummary,
  BoardRepository,
} from '../../../../domain/ports/board.repository';
import { BoardMikroEntity } from '../entities/board.mikro-entity';
import { BoardMemberMikroEntity } from '../entities/board-member.mikro-entity';
import { BoardMapper } from '../mappers/board.mapper';

interface BoardMembershipRow {
  id: string;
  name: string;
  owner_id: string;
  status: 'active' | 'archived';
  created_at: Date;
  member_count: number;
}

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

  async findAllForMember(
    userId: string,
    status: 'active' | 'archived',
  ): Promise<BoardMembershipSummary[]> {
    const rows = await this.em.getConnection().execute<BoardMembershipRow[]>(
      `select b.id, b.name, b.owner_id, b.status, b.created_at,
           (select count(*)::int from board_members bm2 where bm2.board_id = b.id) as member_count
         from boards b
         inner join board_members bm on bm.board_id = b.id
         where bm.user_id = ? and b.status = ?
           and (b.status <> 'archived' or b.owner_id = ?)
         order by b.created_at desc`,
      [userId, status, userId],
    );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      ownerId: row.owner_id,
      status: row.status,
      createdAt: new Date(row.created_at),
      role: row.owner_id === userId ? 'owner' : 'member',
      memberCount: Number(row.member_count),
    }));
  }
}
