import { Migration } from '@mikro-orm/migrations';

export class Migration20260901120619 extends Migration {
  override name = 'Migration20260901120619';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "labels" ("id" uuid not null, "board_id" uuid not null, "name" varchar(255) not null, "color" varchar(255) not null, "created_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "labels" add constraint "labels_board_id_foreign" foreign key ("board_id") references "boards" ("id") on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "labels" cascade;`);
  }
}
