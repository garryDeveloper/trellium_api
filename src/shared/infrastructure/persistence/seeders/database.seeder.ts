import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from '../../../../modules/iam/infrastructure/persistence/mikro-orm/seeders/user.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await this.call(em, [UserSeeder]);
  }
}
