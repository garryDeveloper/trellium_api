import { Migration } from '@mikro-orm/migrations';

export class Migration20260823123225 extends Migration {
  override name = 'Migration20260823123225';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
