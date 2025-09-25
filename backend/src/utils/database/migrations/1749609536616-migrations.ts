import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749609536616 implements MigrationInterface {
  name = 'Migrations1749609536616';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "enabled" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "enabled"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_8e1f623798118e629b46a9e6299"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
  }
}
