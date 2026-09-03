import { Migration } from '@mikro-orm/migrations';

export class Migration20260902125536 extends Migration {
  override name = 'Migration20260902125536';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "checklists" ("id" uuid not null, "name" varchar(255) not null, "card_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "checklist_items" ("id" uuid not null, "text" varchar(500) not null, "completed" boolean not null default false, "position" int not null, "checklist_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "checklists" add constraint "checklists_card_id_foreign" foreign key ("card_id") references "cards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "checklist_items" add constraint "checklist_items_checklist_id_foreign" foreign key ("checklist_id") references "checklists" ("id") on update cascade on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "checklist_items" cascade;`);
    this.addSql(`drop table if exists "checklists" cascade;`);
  }
}
