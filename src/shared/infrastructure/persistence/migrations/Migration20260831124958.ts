import { Migration } from '@mikro-orm/migrations';

export class Migration20260831124958 extends Migration {
  override name = 'Migration20260831124958';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "cards" ("id" uuid not null, "title" varchar(255) not null, "description" varchar(255) null, "position" int not null, "status" text not null default 'active', "due_date" timestamptz null, "list_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "archived_at" timestamptz null, primary key ("id"));`,
    );

    this.addSql(
      `create table "card_assignees" ("card_id" uuid not null, "user_id" uuid not null, "assigned_at" timestamptz not null, primary key ("card_id", "user_id"));`,
    );

    this.addSql(
      `alter table "cards" add constraint "cards_list_id_foreign" foreign key ("list_id") references "lists" ("id") on delete cascade;`,
    );
    this.addSql(
      `alter table "cards" add constraint "cards_status_check" check ("status" in ('active', 'archived'));`,
    );

    this.addSql(
      `alter table "card_assignees" add constraint "card_assignees_card_id_foreign" foreign key ("card_id") references "cards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "card_assignees" add constraint "card_assignees_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "card_assignees" drop constraint "card_assignees_card_id_foreign";`,
    );

    this.addSql(`drop table if exists "cards" cascade;`);
    this.addSql(`drop table if exists "card_assignees" cascade;`);
  }
}
