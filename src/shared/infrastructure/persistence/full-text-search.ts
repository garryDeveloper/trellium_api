/**
 * Traduce el texto que escribe el usuario a una `tsquery` de Postgres, para la
 * búsqueda global (T11.2) y todo lo que la reutilice.
 *
 * Dos decisiones que explican la forma del resultado:
 *
 * - **Prefijo (`:*`) en todos los términos.** La búsqueda se usa mientras se
 *   escribe: sin prefijo, "dise" no encontraría "diseño" y el buscador sólo
 *   respondería a palabras completas.
 * - **`&` entre términos.** Varias palabras acotan, no amplían: quien escribe
 *   "logo home" espera lo que menciona las dos cosas, no la unión.
 *
 * Los acentos NO se pliegan acá: de eso se encarga `tr_unaccent` en SQL (ver la
 * migración que la crea), aplicada tanto al texto indexado como a esta cadena.
 * Un solo lugar decide qué es "la misma letra", así que consulta e índice no
 * pueden quedar desalineados.
 */
export function toPrefixTsQuery(rawQuery: string): string | null {
  const terms = rawQuery
    // Todo lo que no sea letra o dígito separa términos. Deja fuera los
    // operadores de `tsquery` (`&`, `|`, `!`, `:`, paréntesis), así que el texto
    // del usuario no puede alterar la consulta que se arma acá.
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 0);

  if (terms.length === 0) {
    return null;
  }

  return terms.map((term) => `${term}:*`).join(' & ');
}
