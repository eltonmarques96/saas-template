import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1758762458830 implements MigrationInterface {
  name = 'Migrations1758762458830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_ed1251fa3856cd1a6c98d7bcaa3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`,
    );
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "organization_id" character varying(26)`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" DROP CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa"`,
    );
    await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "exam" ADD "id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" ADD CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_ed1251fa3856cd1a6c98d7bcaa3" FOREIGN KEY ("organization_id") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_ed1251fa3856cd1a6c98d7bcaa3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" DROP CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa"`,
    );
    await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "exam" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam" ADD CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "organization_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`,
    );
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_ed1251fa3856cd1a6c98d7bcaa3" FOREIGN KEY ("organization_id") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
  }
}
