import { MigrationInterface, QueryRunner } from "typeorm";

export class LinksGroupLimitChar1740734894090 implements MigrationInterface {
    name = 'LinksGroupLimitChar1740734894090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "group"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "group" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "group"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "group" character varying NOT NULL`);
    }

}
