import {Module} from '@nestjs/common';
import {ReactionRolesController} from './reaction-roles.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ReactionRole} from './models/reaction-role.entity';
import {DiscordModule} from '../discord/discord.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ReactionRole,
        ]),
        DiscordModule,
    ],
    controllers: [
        ReactionRolesController,
    ],
})
export class ReactionRolesModule {
}
