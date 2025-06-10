import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749322021634 implements MigrationInterface {
  name = 'Migrations1749322021634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "activated" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "activated"`);
  }
}
