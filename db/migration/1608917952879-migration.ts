import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1608917952879 implements MigrationInterface {
    name = 'migration1608917952879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `command_data` (`id` int NOT NULL AUTO_INCREMENT, `endpoint` varchar(255) NOT NULL, `type` int NOT NULL, `param_1` float NOT NULL, `param_2` float NOT NULL, `param_3` float NOT NULL, `param_4` float NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `control_data` (`id` int NOT NULL AUTO_INCREMENT, `endpoint` varchar(255) NOT NULL, `controls1` float NOT NULL, `controls2` float NOT NULL, `controls3` float NOT NULL, `controls4` float NOT NULL, `controls5` float NOT NULL, `controls6` float NOT NULL, `controls7` float NOT NULL, `controls8` float NOT NULL, `controls9` float NOT NULL, `controls10` float NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `control_data`");
        await queryRunner.query("DROP TABLE `command_data`");
    }

}
