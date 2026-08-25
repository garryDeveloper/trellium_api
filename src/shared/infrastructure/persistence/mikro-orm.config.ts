import { defineConfig } from '@mikro-orm/postgresql';

const connection = process.env.DATABASE_URL
  ? { clientUrl: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      dbName: process.env.DB_NAME ?? 'trello_clone',
    };

export default defineConfig({
  ...connection,
  entities: ['dist/modules/**/*.mikro-entity.js'],
  entitiesTs: ['src/modules/**/*.mikro-entity.ts'],
  migrations: {
    path: 'dist/shared/infrastructure/persistence/migrations',
    pathTs: 'src/shared/infrastructure/persistence/migrations',
  },
  seeder: {
    path: 'dist/shared/infrastructure/persistence/seeders',
    pathTs: 'src/shared/infrastructure/persistence/seeders',
    defaultSeeder: 'DatabaseSeeder',
  },
  debug: process.env.NODE_ENV !== 'production',
});
