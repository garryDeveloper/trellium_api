import { Migration } from '@mikro-orm/migrations';

export class Migration20260903193723 extends Migration {
  override name = 'Migration20260903193723';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "comments" alter column "body" type text using ("body"::text);`,
    );
  }

  override down(): void | Promise<void> {
    // El cast explícito trunca en Postgres: revertir es lento y con pérdida si
    // ya hay comentarios de más de 255 caracteres.
    this.addSql(
      `alter table "comments" alter column "body" type varchar(255) using ("body"::varchar(255));`,
    );
  }
}
