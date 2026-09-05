import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Activity } from 'src/modules/activities/domain/entities/activity.entity';
import {
  ActivityRepository,
  ActivityWithActor,
} from 'src/modules/activities/domain/ports/activity.repository';
import { ActivityMikroEntity } from '../entities/activity.mikro-entity';
import { ActivityMapper } from '../mappers/activity.mapper';

@Injectable()
export class MikroOrmActivityRepository implements ActivityRepository {
  constructor(private readonly em: EntityManager) {}

  async createMany(activities: Activity[]): Promise<void> {
    if (activities.length === 0) {
      return;
    }

    for (const activity of activities) {
      this.em.create(
        ActivityMikroEntity,
        ActivityMapper.toPersistence(activity),
      );
    }
    // Un solo flush para el lote: un cambio que genera dos eventos no debe
    // costar dos transacciones.
    await this.em.flush();
  }

  async findByCard(cardId: string): Promise<ActivityWithActor[]> {
    const rows = await this.em.find(
      ActivityMikroEntity,
      { card: cardId },
      { populate: ['actor'], orderBy: { createdAt: 'desc' } },
    );

    return rows.map((row) => ({
      activity: ActivityMapper.toDomain(row),
      // El actor viaja resuelto contra `users` y no copiado en el payload: a
      // diferencia de una lista que se renombra, un usuario que cambia su
      // nombre quiere verse con el nombre nuevo en todo el historial.
      actor: row.actor
        ? { id: row.actor.id, name: row.actor.name, email: row.actor.email }
        : null,
    }));
  }
}
