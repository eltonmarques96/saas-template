import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCollectionReview1776391738538 implements MigrationInterface {
  name = 'CreateCollectionReview1776391738538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "collection" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_collection" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "collection_books" (
        "collectionId" uuid NOT NULL,
        "bookId" uuid NOT NULL,
        CONSTRAINT "PK_collection_books" PRIMARY KEY ("collectionId", "bookId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "review" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "stars" integer NOT NULL,
        "comment" text,
        "userId" uuid NOT NULL,
        "bookId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_review_stars" CHECK ("stars" >= 1 AND "stars" <= 5),
        CONSTRAINT "UQ_review_user_book" UNIQUE ("userId", "bookId"),
        CONSTRAINT "PK_review" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "collection"
      ADD CONSTRAINT "FK_collection_user"
      FOREIGN KEY ("userId") REFERENCES "user"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "collection_books"
      ADD CONSTRAINT "FK_collection_books_collection"
      FOREIGN KEY ("collectionId") REFERENCES "collection"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "collection_books"
      ADD CONSTRAINT "FK_collection_books_book"
      FOREIGN KEY ("bookId") REFERENCES "book"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "review"
      ADD CONSTRAINT "FK_review_user"
      FOREIGN KEY ("userId") REFERENCES "user"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "review"
      ADD CONSTRAINT "FK_review_book"
      FOREIGN KEY ("bookId") REFERENCES "book"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_review_book"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_review_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection_books" DROP CONSTRAINT "FK_collection_books_book"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection_books" DROP CONSTRAINT "FK_collection_books_collection"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection" DROP CONSTRAINT "FK_collection_user"`,
    );
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(`DROP TABLE "collection_books"`);
    await queryRunner.query(`DROP TABLE "collection"`);
  }
}
