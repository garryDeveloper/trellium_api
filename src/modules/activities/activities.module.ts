import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ACTIVITY_RECORDER } from 'src/shared/application/ports/activity-recorder.port';
import { ACTIVITY_REPOSITORY } from './domain/ports/activity.repository';
import { ActivityMikroEntity } from './infrastructure/persistence/mikro-orm/entities/activity.mikro-entity';
import { MikroOrmActivityRepository } from './infrastructure/persistence/mikro-orm/repositories/mikro-orm-activity.repository';
import { ActivityRecorderAdapter } from './infrastructure/adapters/activity-recorder.adapter';

/**
 * Módulo de actividad (E13). No importa ningún otro módulo de dominio ni tiene
 * controllers: sólo la entidad, su repositorio y el puerto angosto con el que
 * el resto de la aplicación registra eventos.
 *
 * Los endpoints de lectura viven donde vive su autorización —el historial de
 * tarjeta en `cards`, como `search` y `me/cards`—, que es lo que evita que
 * `activities` y `cards` se importen mutuamente.
 */
@Module({
  imports: [MikroOrmModule.forFeature([ActivityMikroEntity])],
  providers: [
    { provide: ACTIVITY_REPOSITORY, useClass: MikroOrmActivityRepository },
    { provide: ACTIVITY_RECORDER, useClass: ActivityRecorderAdapter },
  ],
  exports: [ACTIVITY_RECORDER, ACTIVITY_REPOSITORY],
})
export class ActivitiesModule {}
