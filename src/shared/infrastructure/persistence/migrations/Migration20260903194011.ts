import { Migration } from '@mikro-orm/migrations';

export class Migration20260903194011 extends Migration {
  override name = 'Migration20260903194011';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "cards" alter column "description" type text using ("description"::text);`,
    );
  }

  override down(): void | Promise<void> {
    // El cast explícito trunca en Postgres: revertir pierde datos si ya hay
    // descripciones de más de 255 caracteres.
    this.addSql(
      `alter table "cards" alter column "description" type varchar(255) using ("description"::varchar(255));`,
    );
  }
}
