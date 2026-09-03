import { Migration } from '@mikro-orm/migrations';

export class Migration20260903195057 extends Migration {
  override name = 'Migration20260903195057';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "attachments" ("id" uuid not null, "filename" varchar(255) not null, "storage_key" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "card_id" uuid not null, "uploader_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "attachments" add constraint "attachments_card_id_foreign" foreign key ("card_id") references "cards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "attachments" add constraint "attachments_uploader_id_foreign" foreign key ("uploader_id") references "users" ("id") on update cascade on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "attachments" cascade;`);
  }
}
