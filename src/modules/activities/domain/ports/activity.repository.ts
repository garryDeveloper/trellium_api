import { Activity } from '../entities/activity.entity';

/** Quién originó el evento, resuelto contra `users` al leer. */
export interface ActivityActor {
  id: string;
  name: string;
  email: string;
}

export interface ActivityWithActor {
  activity: Activity;
  /** `null` si la cuenta del actor ya no existe. */
  actor: ActivityActor | null;
}

/**
 * Sin `update` ni `delete`: una actividad es inmutable y sólo desaparece por la
 * cascada de su tarjeta o su tablero (`domain.md`, regla 17). Que el puerto no
 * los ofrezca es lo que hace cumplir la regla, no un chequeo en un caso de uso.
 */
export interface ActivityRepository {
  /** Alta en lote: un solo cambio puede generar más de un evento. */
  createMany(activities: Activity[]): Promise<void>;
  /** De la más reciente a la más antigua (T13.1). */
  findByCard(cardId: string): Promise<ActivityWithActor[]>;
}

export const ACTIVITY_REPOSITORY = Symbol('ACTIVITY_REPOSITORY');
