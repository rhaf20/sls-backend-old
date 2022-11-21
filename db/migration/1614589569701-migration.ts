import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1614589569701 implements MigrationInterface {
    name = 'migration1614589569701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `system` ADD `default_temp_params` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `system` ADD `default_flow_params` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `system` DROP COLUMN `default_flow_params`");
        await queryRunner.query("ALTER TABLE `system` DROP COLUMN `default_temp_params`");
    }

}
