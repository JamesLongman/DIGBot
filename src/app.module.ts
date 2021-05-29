import {Module} from '@nestjs/common';
import {DiscordModule} from './discord/discord.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandModule} from './commands/command.module';
import {ReactionRolesModule} from './reaction-roles/reaction-roles.module';
import {MessengerModule} from './messenger/messenger.module';
import {McsModule} from './mcs/mcs.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        DiscordModule,
        CommandModule,
        ReactionRolesModule,
        MessengerModule,
        McsModule,
    ],
})
export class AppModule {
}
