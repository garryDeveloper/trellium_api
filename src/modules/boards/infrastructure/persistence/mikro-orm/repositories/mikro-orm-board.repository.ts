import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Board } from '../../../../domain/entities/board.entity';
import { BoardMember } from '../../../../domain/entities/board-member.entity';
import {
  BoardMemberInfo,
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
  async deleteBoard(boardId: string): Promise<void> {
    await this.em.nativeDelete(BoardMikroEntity, { id: boardId });
  }
  async findById(boardId: string): Promise<Board | null> {
    const row = await this.em.findOne(BoardMikroEntity, { id: boardId });

    return row ? BoardMapper.toDomain(row) : null;
  }

  async isMember(boardId: string, userId: string): Promise<boolean> {
    const row = await this.em.findOne(BoardMemberMikroEntity, {
      board: boardId,
      user: userId,
    });

    return row !== null;
  }
  async filterMemberBoardIds(
    userId: string,
    boardIds: string[],
  ): Promise<string[]> {
    if (boardIds.length === 0) {
      return [];
    }

    const rows = await this.em.find(BoardMemberMikroEntity, {
      user: userId,
      board: { $in: boardIds },
    });

    return rows.map((row) => row.board.id);
  }

  async update(board: Board): Promise<Board> {
    const ref = this.em.getReference(BoardMikroEntity, board.id);
    this.em.assign(ref, BoardMapper.toPersistence(board));
    await this.em.flush();
    return board;
  }

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

  async findMembers(boardId: string): Promise<BoardMemberInfo[]> {
    const rows = await this.em.find(
      BoardMemberMikroEntity,
      { board: boardId },
      { populate: ['user'], orderBy: { joinedAt: 'asc' } },
    );

    return rows.map((row) => ({
      userId: row.user.id,
      name: row.user.name,
      email: row.user.email,
    }));
  }

  async removeMember(boardId: string, userId: string): Promise<void> {
    await this.em.nativeDelete(BoardMemberMikroEntity, {
      board: boardId,
      user: userId,
    });
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
