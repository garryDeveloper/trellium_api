import { Migration } from '@mikro-orm/migrations';

export class Migration20260825145334 extends Migration {
  override name = 'Migration20260825145334';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "boards" ("id" uuid not null, "name" varchar(255) not null, "owner_id" uuid not null, "status" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "archived_at" timestamptz null, primary key ("id"));`,
    );

    this.addSql(
      `create table "board_members" ("board_id" uuid not null, "user_id" uuid not null, "joined_at" timestamptz not null, primary key ("board_id", "user_id"));`,
    );

    this.addSql(
      `alter table "boards" add constraint "boards_status_check" check ("status" in ('active', 'archived'));`,
    );

    this.addSql(
      `alter table "boards" add constraint "boards_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "board_members" add constraint "board_members_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "board_members" add constraint "board_members_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "boards" cascade;`);
    this.addSql(`drop table if exists "board_members" cascade;`);
  }
}
