import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1740734593720 implements MigrationInterface {
    name = 'Init1740734593720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_links_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."idx_links_url"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "links_rating_check"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "links_pkey"`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "group"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "group" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "userEmail"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "userEmail" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "userEmail"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "userEmail" text`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "title" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "group"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "group" text`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6"`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "links_rating_check" CHECK (((rating >= 1) AND (rating <= 5)))`);
        await queryRunner.query(`CREATE INDEX "idx_links_url" ON "links" ("url") `);
        await queryRunner.query(`CREATE INDEX "idx_links_created_at" ON "links" ("created_at") `);
    }

}
