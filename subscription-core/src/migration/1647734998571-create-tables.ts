import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1647734998571 implements MigrationInterface {
    name = 'createTables1647734998571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying, "gender" character varying, "dateOfBirth" TIMESTAMP NOT NULL, "newsletterId" integer NOT NULL, "flagForConsent" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_ba857f4e5d61b74f184c26de3c4" UNIQUE ("email"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscription"`);
    }

}
