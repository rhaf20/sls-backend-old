import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1609234696570 implements MigrationInterface {
    name = 'migration1609234696570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `system` DROP COLUMN `endpoint`");
        await queryRunner.query("ALTER TABLE `system` CHANGE `name` `name` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `system` ADD UNIQUE INDEX `IDX_74996724856c168c26b99bd21c` (`name`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `system` DROP INDEX `IDX_74996724856c168c26b99bd21c`");
        await queryRunner.query("ALTER TABLE `system` CHANGE `name` `name` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `system` ADD `endpoint` varchar(255) NOT NULL");
    }

}
