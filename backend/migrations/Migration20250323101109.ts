import { Migration } from '@mikro-orm/migrations';

export class Migration20250323101109 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "news_model" alter column "description" type varchar(1000) using ("description"::varchar(1000));`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "news_model" alter column "description" type varchar(255) using ("description"::varchar(255));`
    );
  }
}
