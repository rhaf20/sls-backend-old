import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1608831028771 implements MigrationInterface {
    name = 'migration1608831028771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `given_name` varchar(255) NOT NULL, `family_name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `phone_number` varchar(255) NOT NULL, `role` varchar(255) NOT NULL DEFAULT 'USER', `company` varchar(255) NULL, `notes` varchar(255) NULL, `active` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `system` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `endpoint` varchar(255) NOT NULL, `type` int NOT NULL DEFAULT '0', `hpwh_primary_manufacturer` int NOT NULL DEFAULT '0', `hpwh_primary_number` int NOT NULL, `hpwh_primary_model` varchar(255) NOT NULL, `hpwh_primary_btuhr` float NOT NULL, `hpwh_recirc_manufacturer` int NOT NULL DEFAULT '0', `hpwh_recirc_number` int NOT NULL, `hpwh_recirc_model` varchar(255) NULL, `hpwh_recirc_btuhr` float NULL, `storage_primary_number` int NULL, `storage_primary_total_gallon` float NULL, `storage_recirc_number` int NULL, `storage_recirc_total_gallon` float NULL, `storage_locus_total_gallon` float NULL, `resistance_primary_kw` float NULL, `resistance_recirc_kw` float NULL, `hybrid_hpwh_gas` tinyint NOT NULL DEFAULT 1, `location` varchar(255) NOT NULL, `notes` varchar(255) NULL, `active` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `buildingId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `building` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `street` varchar(255) NOT NULL, `city` varchar(255) NOT NULL, `state` varchar(255) NOT NULL, `zipcode` varchar(255) NOT NULL, `type` int NOT NULL DEFAULT '0', `owner_first_name` varchar(255) NULL, `owner_last_name` varchar(255) NULL, `owner_company` varchar(255) NULL, `owner_phone` varchar(255) NULL, `owner_email` varchar(255) NULL, `utility` int NOT NULL DEFAULT '0', `climate_zone` int NOT NULL, `group_weather` int NULL, `group_energy_supply` int NULL, `group_dispatch` int NULL, `onsite_solar_pv` tinyint NOT NULL, `number_story` int NOT NULL, `number_housing_unit` int NOT NULL, `notes` varchar(255) NULL, `active` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `system_users_user` (`systemId` int NOT NULL, `userId` int NOT NULL, INDEX `IDX_83f959e1d3a5079bd1a27a5c48` (`systemId`), INDEX `IDX_c1722aedddc5d9a38415f58be3` (`userId`), PRIMARY KEY (`systemId`, `userId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `system` ADD CONSTRAINT `FK_aa567aa84929a9132ea704a4c98` FOREIGN KEY (`buildingId`) REFERENCES `building`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `system_users_user` ADD CONSTRAINT `FK_83f959e1d3a5079bd1a27a5c48b` FOREIGN KEY (`systemId`) REFERENCES `system`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `system_users_user` ADD CONSTRAINT `FK_c1722aedddc5d9a38415f58be37` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `system_users_user` DROP FOREIGN KEY `FK_c1722aedddc5d9a38415f58be37`");
        await queryRunner.query("ALTER TABLE `system_users_user` DROP FOREIGN KEY `FK_83f959e1d3a5079bd1a27a5c48b`");
        await queryRunner.query("ALTER TABLE `system` DROP FOREIGN KEY `FK_aa567aa84929a9132ea704a4c98`");
        await queryRunner.query("DROP INDEX `IDX_c1722aedddc5d9a38415f58be3` ON `system_users_user`");
        await queryRunner.query("DROP INDEX `IDX_83f959e1d3a5079bd1a27a5c48` ON `system_users_user`");
        await queryRunner.query("DROP TABLE `system_users_user`");
        await queryRunner.query("DROP TABLE `building`");
        await queryRunner.query("DROP TABLE `system`");
        await queryRunner.query("DROP TABLE `user`");
    }

}
