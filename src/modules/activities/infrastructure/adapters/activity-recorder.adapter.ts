import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ActivityRecorderPort,
  RecordableActivity,
} from 'src/shared/application/ports/activity-recorder.port';
import { Activity } from '../../domain/entities/activity.entity';
import {
  ACTIVITY_REPOSITORY,
  type ActivityRepository,
} from '../../domain/ports/activity.repository';

@Injectable()
export class ActivityRecorderAdapter implements ActivityRecorderPort {
  private readonly logger = new Logger(ActivityRecorderAdapter.name);

  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activities: ActivityRepository,
  ) {}

  /**
   * Registrar es un efecto secundario, igual que notificar: si falla, la acción
   * que lo disparó ya se completó y no tiene por qué romperse. Se loguea y
   * sigue — perder una línea del historial es malo, deshacer un movimiento de
   * tarjeta que el usuario ya vio en pantalla es peor.
   */
  async record(activities: RecordableActivity[]): Promise<void> {
    if (activities.length === 0) {
      return;
    }

    try {
      await this.activities.createMany(
        activities.map((activity) => Activity.create(activity)),
      );
    } catch (error) {
      this.logger.error(
        `No se pudieron registrar ${activities.length} actividad(es).`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
