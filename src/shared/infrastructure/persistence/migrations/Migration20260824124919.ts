import { Migration } from '@mikro-orm/migrations';

export class Migration20260824124919 extends Migration {
  override name = 'Migration20260824124919';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "revoked_tokens" ("jti" uuid not null, "expires_at" timestamptz not null, primary key ("jti"));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "revoked_tokens" cascade;`);
  }
}
