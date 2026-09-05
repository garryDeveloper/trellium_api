import { Migration } from '@mikro-orm/migrations';

export class Migration20260905160000 extends Migration {
  override name = 'Migration20260905160000';

  override up(): void | Promise<void> {
    // Registro de actividad (E13). `payload` guarda los valores del cambio ya
    // resueltos —nombres, no ids— para que el historial siga siendo legible
    // después de que lo referido se renombre o se elimine (`domain.md`, 18).
    this.addSql(
      `create table "activities" ("id" uuid not null, "board_id" uuid not null, "card_id" uuid null, "actor_user_id" uuid not null, "type" text not null, "payload" jsonb not null, "created_at" timestamptz not null, constraint "activities_pkey" primary key ("id"));`,
    );

    // CASCADE en las tres: el historial es información sobre el objeto y no
    // sobrevive a su eliminación definitiva (`domain.md`, regla 11).
    this.addSql(
      `alter table "activities" add constraint "activities_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "activities" add constraint "activities_card_id_foreign" foreign key ("card_id") references "cards" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "activities" add constraint "activities_actor_user_id_foreign" foreign key ("actor_user_id") references "users" ("id") on update cascade on delete cascade;`,
    );

    // Los 18 tipos de `data-model.md`. Los de lista y `comment_added` todavía
    // no se emiten (son de T13.2), pero entran ahora: el enum es el contrato de
    // la columna y ampliarlo después es otra migración.
    this.addSql(
      `alter table "activities" add constraint "activities_type_check" check ("type" in ('card_created', 'card_moved', 'card_renamed', 'card_described', 'card_archived', 'card_unarchived', 'assignee_added', 'assignee_removed', 'label_applied', 'label_removed', 'due_date_set', 'due_date_cleared', 'attachment_added', 'attachment_removed', 'comment_added', 'list_created', 'list_renamed', 'list_archived'));`,
    );

    // Los dos accesos del historial: por tarjeta (T13.1) y por tablero (T13.2),
    // siempre del más reciente al más antiguo.
    this.addSql(
      `create index "activities_card_id_created_at_index" on "activities" ("card_id", "created_at" desc);`,
    );
    this.addSql(
      `create index "activities_board_id_created_at_index" on "activities" ("board_id", "created_at" desc);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "activities" cascade;`);
  }
}
