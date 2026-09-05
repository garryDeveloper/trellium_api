import { Migration } from '@mikro-orm/migrations';

export class Migration20260904120000 extends Migration {
  override name = 'Migration20260904120000';

  override up(): void | Promise<void> {
    // Plegado de acentos para la búsqueda global (T11.2). `unaccent` sería la
    // opción obvia, pero es una extensión (no siempre disponible en el Postgres
    // gestionado) y además es STABLE, así que no se puede indexar sin envolverla
    // igual. `translate` sobre el juego de caracteres del español es IMMUTABLE,
    // no necesita extensión y hace exactamente lo que pide el criterio de T11.2:
    // "diseño", "diseno" y "DISEÑO" terminan en el mismo texto.
    //
    // `lower()` primero, así sólo hace falta mapear las minúsculas acentuadas.
    this.addSql(
      `create or replace function tr_unaccent(text)
         returns text
         language sql
         immutable
         strict
         parallel safe
       as $$
         select translate(
           lower($1),
           'áàäâãéèëêíìïîóòöôõúùüûñç',
           'aaaaaeeeeiiiiooooouuuunc'
         )
       $$;`,
    );

    // Índices GIN sobre el vector de búsqueda (`data-model.md`, "Índices
    // adicionales"). La expresión tiene que ser idéntica, carácter por carácter,
    // a la del `where` de las queries de búsqueda: si difiere, Postgres no
    // reconoce el índice y cae a un seq scan.
    this.addSql(
      `create index "cards_search_idx" on "cards" using gin (
         to_tsvector('spanish', tr_unaccent("title" || ' ' || coalesce("description", '')))
       );`,
    );
    this.addSql(
      `create index "boards_search_idx" on "boards" using gin (
         to_tsvector('spanish', tr_unaccent("name"))
       );`,
    );

    // La búsqueda entra siempre por los tableros del usuario; sin este índice
    // el filtro de membresía es un scan de `board_members`.
    this.addSql(
      `create index "board_members_user_id_index" on "board_members" ("user_id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop index if exists "board_members_user_id_index";`);
    this.addSql(`drop index if exists "boards_search_idx";`);
    this.addSql(`drop index if exists "cards_search_idx";`);
    this.addSql(`drop function if exists tr_unaccent(text);`);
  }
}
