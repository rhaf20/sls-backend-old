import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1608838684146 implements MigrationInterface {
    name = 'migration1608838684146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `process_data_structure` (`id` int NOT NULL AUTO_INCREMENT, `field` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `unit` varchar(255) NOT NULL, `permission` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_d4f07566d4d5b7bb95fda99614` (`field`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_d4f07566d4d5b7bb95fda99614` ON `process_data_structure`");
        await queryRunner.query("DROP TABLE `process_data_structure`");
    }

}
