import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBranchesAndVehicles1774873865818 implements MigrationInterface {
    name = 'AddBranchesAndVehicles1774873865818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "branch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "zip" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_638479fc29fab932b7ab0aea912" UNIQUE ("code"), CONSTRAINT "PK_2e39f426e2faefdaa93c5961976" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_638479fc29fab932b7ab0aea91" ON "branch" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_52824a0b9b1b552a0650b6d3bb" ON "branch" ("city") `);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "plate" character varying NOT NULL, "brand" character varying NOT NULL, "model" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "branchId" uuid NOT NULL, CONSTRAINT "UQ_ad9b0f5ce78684a10b854ba59d1" UNIQUE ("code"), CONSTRAINT "UQ_51922d0c6647cb10de3f76ba4e3" UNIQUE ("plate"), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad9b0f5ce78684a10b854ba59d" ON "vehicle" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_51922d0c6647cb10de3f76ba4e" ON "vehicle" ("plate") `);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_ac5fa698225d996b4db0741a1a0" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_ac5fa698225d996b4db0741a1a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51922d0c6647cb10de3f76ba4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad9b0f5ce78684a10b854ba59d"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52824a0b9b1b552a0650b6d3bb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_638479fc29fab932b7ab0aea91"`);
        await queryRunner.query(`DROP TABLE "branch"`);
    }

}
