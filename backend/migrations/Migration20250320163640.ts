import { Migration } from '@mikro-orm/migrations';

export class Migration20250320163640 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "news_model" alter column "comments_count" type int using ("comments_count"::int);`
    );
    this.addSql(
      `alter table "news_model" alter column "comments_count" drop not null;`
    );
    this.addSql(
      `alter table "news_model" alter column "date" type timestamptz using ("date"::timestamptz);`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "news_model" alter column "date" type date using ("date"::date);`
    );
    this.addSql(
      `alter table "news_model" alter column "comments_count" type int4 using ("comments_count"::int4);`
    );
    this.addSql(
      `alter table "news_model" alter column "comments_count" set not null;`
    );
  }
}
