import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as argon2 from 'argon2';
import { UserMikroEntity } from '../entities/user.mikro-entity';

/** Contraseña compartida por todos los usuarios de seed, solo para desarrollo local. */
export const SEED_USER_PASSWORD = 'Password123!';

const SEED_USERS = [
  { name: 'Ana García', email: 'ana.garcia@example.com' },
  { name: 'Bruno Fernández', email: 'bruno.fernandez@example.com' },
  { name: 'Carla Rodríguez', email: 'carla.rodriguez@example.com' },
  { name: 'Diego Martínez', email: 'diego.martinez@example.com' },
  { name: 'Elena Sánchez', email: 'elena.sanchez@example.com' },
];

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const passwordHash = await argon2.hash(SEED_USER_PASSWORD);

    for (const user of SEED_USERS) {
      const exists = await em.findOne(UserMikroEntity, { email: user.email });
      if (exists) {
        continue;
      }

      em.create(UserMikroEntity, {
        name: user.name,
        email: user.email,
        passwordHash,
      });
    }
  }
}
