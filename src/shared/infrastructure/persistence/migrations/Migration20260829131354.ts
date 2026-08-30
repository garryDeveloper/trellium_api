import { Migration } from '@mikro-orm/migrations';

export class Migration20260829131354 extends Migration {
  override name = 'Migration20260829131354';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "invitations" ("id" uuid not null, "board_id" uuid not null, "invited_email" varchar(255) not null, "invited_by_user_id" uuid not null, "status" text not null, "created_at" timestamptz not null, "resolved_at" timestamptz null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "invitations" add constraint "invitations_board_id_foreign" foreign key ("board_id") references "boards" ("id") on delete cascade;`,
    );
    this.addSql(
      `alter table "invitations" add constraint "invitations_invited_by_user_id_foreign" foreign key ("invited_by_user_id") references "users" ("id");`,
    );
    this.addSql(
      `alter table "invitations" add constraint "invitations_status_check" check ("status" in ('pending', 'accepted', 'rejected'));`,
    );

    this.addSql(
      `create unique index "invitations_board_id_invited_email_pending_unique" on "invitations" ("board_id", "invited_email") where "status" = 'pending';`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "invitations" cascade;`);
  }
}
