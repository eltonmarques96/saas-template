import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1758758706690 implements MigrationInterface {
  name = 'Migrations1758758706690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" uuid, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_ed1251fa3856cd1a6c98d7bcaa3" FOREIGN KEY ("organization_id") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_ed1251fa3856cd1a6c98d7bcaa3"`,
    );
    await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "createdAt"`);
    await queryRunner.query(`DROP TABLE "organization"`);
  }
}
