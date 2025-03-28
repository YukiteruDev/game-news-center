import { Migration } from '@mikro-orm/migrations';

export class Migration20250328181143 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "news_model" ("id" uuid not null default gen_random_uuid(), "link" varchar(255) not null, "title" varchar(255) not null, "description" varchar(1000) null, "date" timestamptz not null, "comments_count" int null default 0, "thumbnail" varchar(255) not null, "source" varchar(255) not null, "created_at" date not null, "updated_at" date not null, constraint "news_model_pkey" primary key ("id"));`
    );
    this.addSql(
      `create index "news_model_link_index" on "news_model" ("link");`
    );
    this.addSql(
      `alter table "news_model" add constraint "news_model_link_unique" unique ("link");`
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "news_model" cascade;`);
  }
}
