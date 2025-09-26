import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1758847587789 implements MigrationInterface {
  name = 'Migrations1758847587789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "enabled"`);
    await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "estado_id"`);
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_37ecd8addf395545dcb0242a593"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ALTER COLUMN "state_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_37ecd8addf395545dcb0242a593" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_37ecd8addf395545dcb0242a593"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ALTER COLUMN "state_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_37ecd8addf395545dcb0242a593" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD "estado_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "enabled" boolean NOT NULL DEFAULT true`,
    );
  }
}
