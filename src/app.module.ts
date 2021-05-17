import {Module} from '@nestjs/common';
import {DiscordModule} from './discord/discord.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandModule} from './commands/command.module';
import {ReactionRolesModule} from './reaction-roles/reaction-roles.module';
import {MessengerModule} from './messenger/messenger.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        DiscordModule,
        CommandModule,
        ReactionRolesModule,
        MessengerModule,
    ],
})
export class AppModule {
}
