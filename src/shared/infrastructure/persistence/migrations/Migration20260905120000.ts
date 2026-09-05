import { Migration } from '@mikro-orm/migrations';

export class Migration20260905120000 extends Migration {
  override name = 'Migration20260905120000';

  override up(): void | Promise<void> {
    // Preferencia de vista por usuario y por tablero (T12.1, T12.3). La PK es
    // el par (board_id, user_id): dos miembros del mismo tablero pueden verlo
    // de forma distinta, y cada uno tiene a lo sumo una preferencia.
    this.addSql(
      `create table "board_view_preferences" ("board_id" uuid not null, "user_id" uuid not null, "view" text not null default 'board', "group_by" text not null default 'list', "updated_at" timestamptz not null, constraint "board_view_preferences_pkey" primary key ("board_id", "user_id"));`,
    );

    this.addSql(
      `alter table "board_view_preferences" add constraint "board_view_preferences_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "board_view_preferences" add constraint "board_view_preferences_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "board_view_preferences" add constraint "board_view_preferences_view_check" check ("view" in ('board', 'table', 'calendar'));`,
    );
    this.addSql(
      `alter table "board_view_preferences" add constraint "board_view_preferences_group_by_check" check ("group_by" in ('list', 'assignee', 'label', 'due_date'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "board_view_preferences" cascade;`);
  }
}
