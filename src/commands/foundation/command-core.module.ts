import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {WhitelistedChannel} from './models/whitelisted-channel.entity';
import {DiscoveryModule} from '@nestjs/core';
import {DiscordModule} from '../../discord/discord.module';
import {GuildSettingsService} from './services/guild-settings.service';
import {CommandContainer} from './command.container';
import {MetadataAccessor} from './helpers/metadata.accessor';
import {CommandExplorer} from './command.explorer';
import {CommandController} from './command.controller';
import {AdminRole} from './models/admin-role.entity';
import {HelpController} from './help.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WhitelistedChannel,
            AdminRole,
        ]),
        DiscoveryModule,
        DiscordModule,
    ],
    providers: [
        GuildSettingsService,
        CommandContainer,
        MetadataAccessor,
        CommandExplorer,
    ],
    controllers: [
        CommandController,
        HelpController,
    ],
})
export class CommandCoreModule {
}
