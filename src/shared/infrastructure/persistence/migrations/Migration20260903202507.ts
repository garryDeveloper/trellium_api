import { Migration } from '@mikro-orm/migrations';

export class Migration20260903202507 extends Migration {
  override name = 'Migration20260903202507';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "notifications" ("id" uuid not null, "user_id" uuid not null, "type" text not null, "actor_id" uuid not null, "actor_name" varchar(255) not null, "board_id" uuid null, "board_name" varchar(255) not null, "card_id" uuid null, "card_title" varchar(255) null, "read_at" timestamptz null, "created_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "notifications" add constraint "notifications_type_check" check ("type" in ('card_assigned', 'card_commented', 'board_invited'));`,
    );

    // Destinatario y actor son cuentas: si se borra el usuario, sus
    // notificaciones se van con él.
    this.addSql(
      `alter table "notifications" add constraint "notifications_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "notifications" add constraint "notifications_actor_id_foreign" foreign key ("actor_id") references "users" ("id") on update cascade on delete cascade;`,
    );

    // Tablero y tarjeta van `set null`, no `cascade`: la notificación sobrevive
    // al borrado para poder avisar que el contenido referenciado ya no existe
    // (`screens.md` → Notificaciones). El nombre queda en las columnas snapshot.
    this.addSql(
      `alter table "notifications" add constraint "notifications_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "notifications" add constraint "notifications_card_id_foreign" foreign key ("card_id") references "cards" ("id") on update cascade on delete set null;`,
    );

    // El listado siempre es "las mías, de la más nueva a la más vieja".
    this.addSql(
      `create index "notifications_user_id_created_at_index" on "notifications" ("user_id", "created_at" desc);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "notifications" cascade;`);
  }
}
