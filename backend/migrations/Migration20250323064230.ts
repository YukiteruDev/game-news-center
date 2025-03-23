import { Migration } from '@mikro-orm/migrations';

export class Migration20250323064230 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "news_model" add column "description" varchar(255) not null default '';`
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "news_model" drop column "description";`);
  }
}
