import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthorCategoryBook1776391673561
  implements MigrationInterface
{
  name = 'CreateAuthorCategoryBook1776391673561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "author" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "pageUrl" character varying,
        "photoUrl" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_author" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "pageUrl" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_category_name" UNIQUE ("name"),
        CONSTRAINT "PK_category" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "book" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "coverUrl" character varying,
        "synopsis" text,
        "pages" integer,
        "publishedDate" date,
        "publisher" character varying,
        "isbn" character varying,
        "siteUrl" character varying,
        "openLibraryId" character varying,
        "viewCount" integer NOT NULL DEFAULT 0,
        "authorId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_book_isbn" UNIQUE ("isbn"),
        CONSTRAINT "UQ_book_openLibraryId" UNIQUE ("openLibraryId"),
        CONSTRAINT "PK_book" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "book_categories" (
        "bookId" uuid NOT NULL,
        "categoryId" uuid NOT NULL,
        CONSTRAINT "PK_book_categories" PRIMARY KEY ("bookId", "categoryId")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "book"
      ADD CONSTRAINT "FK_book_author"
      FOREIGN KEY ("authorId") REFERENCES "author"("id")
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "book_categories"
      ADD CONSTRAINT "FK_book_categories_book"
      FOREIGN KEY ("bookId") REFERENCES "book"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "book_categories"
      ADD CONSTRAINT "FK_book_categories_category"
      FOREIGN KEY ("categoryId") REFERENCES "category"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_categories" DROP CONSTRAINT "FK_book_categories_category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_categories" DROP CONSTRAINT "FK_book_categories_book"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_book_author"`,
    );
    await queryRunner.query(`DROP TABLE "book_categories"`);
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "author"`);
  }
}
