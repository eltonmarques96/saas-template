import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1758762310441 implements MigrationInterface {
  name = 'Migrations1758762310441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "state" ("id" integer NOT NULL, "nome" character varying NOT NULL, "sigla" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "data_registro" TIMESTAMP NOT NULL DEFAULT now(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_23c271185832fb563d5edea8aeb" UNIQUE ("nome"), CONSTRAINT "UQ_87fa808a138225037f3b3757cba" UNIQUE ("sigla"), CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" integer NOT NULL, "nome" character varying NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "estado_id" integer NOT NULL, "state_id" integer, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" text NOT NULL DEFAULT 'default'`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_37ecd8addf395545dcb0242a593" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_37ecd8addf395545dcb0242a593"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "state"`);
  }
}
