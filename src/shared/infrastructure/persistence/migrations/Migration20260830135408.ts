import { Migration } from '@mikro-orm/migrations';

export class Migration20260830135408 extends Migration {
  override name = 'Migration20260830135408';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "lists" ("id" uuid not null, "name" varchar(255) not null, "position" int not null, "board_id" uuid not null, "status" text not null default 'active', "created_at" timestamptz not null, "updated_at" timestamptz not null, "archived_at" timestamptz null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "lists" add constraint "lists_board_id_foreign" foreign key ("board_id") references "boards" ("id") on delete cascade;`,
    );
    this.addSql(
      `alter table "lists" add constraint "lists_status_check" check ("status" in ('active', 'archived'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "lists" cascade;`);
  }
}
