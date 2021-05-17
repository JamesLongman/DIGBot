import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialSetup1621277025438 implements MigrationInterface {
    name = 'InitialSetup1621277025438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `commands_dragons` (`id` int NOT NULL AUTO_INCREMENT, `guildId` varchar(255) NOT NULL, `roleId` varchar(255) NOT NULL, INDEX `IDX_a49b3a45c5b1dd16c04e723d95` (`roleId`), UNIQUE INDEX `IDX_166059c234f0f5603363153a02` (`guildId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `commands_admin_roles` (`id` int NOT NULL AUTO_INCREMENT, `guildId` varchar(255) NOT NULL, `roleId` varchar(255) NOT NULL, INDEX `IDX_7ef5c2645814704980bb8ef554` (`guildId`), UNIQUE INDEX `IDX_fb7f5648e141ebca3c132d1c87` (`roleId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `commands_channel` (`id` int NOT NULL AUTO_INCREMENT, `guildId` varchar(255) NOT NULL, `channelId` varchar(255) NOT NULL, INDEX `IDX_27aae4af90bef74558c88f5916` (`guildId`), UNIQUE INDEX `IDX_dee002d4f7c6d6c4ce5856a61c` (`channelId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `messenger_join` (`id` int NOT NULL AUTO_INCREMENT, `guildId` varchar(255) NOT NULL, `channelId` varchar(255) NULL, `message` text NOT NULL, INDEX `IDX_7da14814197d1a03c923e07935` (`guildId`), UNIQUE INDEX `IDX_c2cded0328672d723a803f9f51` (`guildId`, `channelId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `messenger_role` (`id` int NOT NULL AUTO_INCREMENT, `guildId` varchar(255) NOT NULL, `roleId` varchar(255) NOT NULL, `channelId` varchar(255) NULL, `message` text NOT NULL, INDEX `IDX_97caf37cdb9f1b986ab2455bee` (`guildId`), UNIQUE INDEX `IDX_342907c0493b2eed02f185eeed` (`roleId`), UNIQUE INDEX `IDX_c4987f1129e9fef9a7424bc744` (`roleId`, `channelId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `rr_role` (`id` int NOT NULL AUTO_INCREMENT, `guildId` varchar(255) NOT NULL, `channelId` varchar(255) NOT NULL, `messageId` varchar(255) NOT NULL, `emoji` varchar(255) NOT NULL, `roleId` varchar(255) NOT NULL, INDEX `IDX_c2fc8777c2a2f4503646855910` (`guildId`), INDEX `IDX_ed0316b871b062bf87d72b87fd` (`messageId`), INDEX `IDX_0b074602b342d95ca2d745e898` (`roleId`), UNIQUE INDEX `IDX_07ab124b5a989f5afba2f6b479` (`messageId`, `emoji`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_07ab124b5a989f5afba2f6b479` ON `rr_role`");
        await queryRunner.query("DROP INDEX `IDX_0b074602b342d95ca2d745e898` ON `rr_role`");
        await queryRunner.query("DROP INDEX `IDX_ed0316b871b062bf87d72b87fd` ON `rr_role`");
        await queryRunner.query("DROP INDEX `IDX_c2fc8777c2a2f4503646855910` ON `rr_role`");
        await queryRunner.query("DROP TABLE `rr_role`");
        await queryRunner.query("DROP INDEX `IDX_c4987f1129e9fef9a7424bc744` ON `messenger_role`");
        await queryRunner.query("DROP INDEX `IDX_342907c0493b2eed02f185eeed` ON `messenger_role`");
        await queryRunner.query("DROP INDEX `IDX_97caf37cdb9f1b986ab2455bee` ON `messenger_role`");
        await queryRunner.query("DROP TABLE `messenger_role`");
        await queryRunner.query("DROP INDEX `IDX_c2cded0328672d723a803f9f51` ON `messenger_join`");
        await queryRunner.query("DROP INDEX `IDX_7da14814197d1a03c923e07935` ON `messenger_join`");
        await queryRunner.query("DROP TABLE `messenger_join`");
        await queryRunner.query("DROP INDEX `IDX_dee002d4f7c6d6c4ce5856a61c` ON `commands_channel`");
        await queryRunner.query("DROP INDEX `IDX_27aae4af90bef74558c88f5916` ON `commands_channel`");
        await queryRunner.query("DROP TABLE `commands_channel`");
        await queryRunner.query("DROP INDEX `IDX_fb7f5648e141ebca3c132d1c87` ON `commands_admin_roles`");
        await queryRunner.query("DROP INDEX `IDX_7ef5c2645814704980bb8ef554` ON `commands_admin_roles`");
        await queryRunner.query("DROP TABLE `commands_admin_roles`");
        await queryRunner.query("DROP INDEX `IDX_166059c234f0f5603363153a02` ON `commands_dragons`");
        await queryRunner.query("DROP INDEX `IDX_a49b3a45c5b1dd16c04e723d95` ON `commands_dragons`");
        await queryRunner.query("DROP TABLE `commands_dragons`");
    }

}
