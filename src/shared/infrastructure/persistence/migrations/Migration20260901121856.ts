import { Migration } from '@mikro-orm/migrations';

export class Migration20260901121856 extends Migration {
  override name = 'Migration20260901121856';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "card_labels" ("card_id" uuid not null, "label_id" uuid not null, primary key ("card_id", "label_id"));`,
    );

    this.addSql(
      `alter table "card_labels" add constraint "card_labels_card_id_foreign" foreign key ("card_id") references "cards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "card_labels" add constraint "card_labels_label_id_foreign" foreign key ("label_id") references "labels" ("id") on update cascade on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "card_labels" cascade;`);
  }
}
