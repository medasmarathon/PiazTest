import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1740734593720 implements MigrationInterface {
    name = 'Init1740734593720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "links" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "created_at" TIMESTAMP NOT NULL,
            "description" character varying,
            "group" character varying NOT NULL,
            "title" character varying NOT NULL,
            "url" character varying NOT NULL,
            "userEmail" character varying NOT NULL,
            "rating" int,
            CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE INDEX "idx_links_url" ON "links" ("url") `);
        await queryRunner.query(`CREATE INDEX "idx_links_created_at" ON "links" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "links"`);
    }
}
