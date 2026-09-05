import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { BoardViewPreferences } from '../../../../domain/entities/board-view-preferences.entity';
import { BoardViewPreferencesRepository } from '../../../../domain/ports/board-view-preferences.repository';
import { BoardViewPreferencesMikroEntity } from '../entities/board-view-preferences.mikro-entity';
import { BoardViewPreferencesMapper } from '../mappers/board-view-preferences.mapper';

@Injectable()
export class MikroOrmBoardViewPreferencesRepository implements BoardViewPreferencesRepository {
  constructor(private readonly em: EntityManager) {}

  async find(
    boardId: string,
    userId: string,
  ): Promise<BoardViewPreferences | null> {
    const row = await this.em.findOne(BoardViewPreferencesMikroEntity, {
      board: boardId,
      user: userId,
    });

    return row ? BoardViewPreferencesMapper.toDomain(row) : null;
  }

  async save(preferences: BoardViewPreferences): Promise<BoardViewPreferences> {
    // `upsert` y no find-then-create: la clave primaria es (board, user), así
    // que dos pestañas del mismo usuario cambiando de vista a la vez chocarían
    // en el insert. El `on conflict` lo resuelve Postgres.
    await this.em.upsert(
      BoardViewPreferencesMikroEntity,
      BoardViewPreferencesMapper.toPersistence(preferences),
    );

    return preferences;
  }
}
