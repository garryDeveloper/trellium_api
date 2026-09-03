import { Migration } from '@mikro-orm/migrations';

export class Migration20260903190304 extends Migration {
  override name = 'Migration20260903190304';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "comments" ("id" uuid not null, "body" varchar(255) not null, "card_id" uuid not null, "author_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "comments" add constraint "comments_card_id_foreign" foreign key ("card_id") references "cards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "comments" add constraint "comments_author_id_foreign" foreign key ("author_id") references "users" ("id") on update cascade on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "comments" cascade;`);
  }
}
