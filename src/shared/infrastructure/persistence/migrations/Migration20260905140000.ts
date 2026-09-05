import { Migration } from '@mikro-orm/migrations';

export class Migration20260905140000 extends Migration {
  override name = 'Migration20260905140000';

  override up(): void | Promise<void> {
    // "Mi trabajo" (T12.4) entra por el usuario asignado. La PK de la tabla es
    // el par (card_id, user_id), y un índice compuesto no sirve para buscar por
    // la segunda columna sola: sin este índice, cada apertura de la pantalla es
    // un scan de `card_assignees`.
    this.addSql(
      `create index "card_assignees_user_id_index" on "card_assignees" ("user_id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop index if exists "card_assignees_user_id_index";`);
  }
}
