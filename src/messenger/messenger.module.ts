import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RoleMessenger} from './models/role-messenger.entity';
import {JoinMessenger} from './models/join-messenger.entity';
import {MessengerController} from './messenger.controller';
import {DiscordModule} from '../discord/discord.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            RoleMessenger,
            JoinMessenger,
        ]),
        DiscordModule,
    ],
    controllers: [
        MessengerController,
    ],
})
export class MessengerModule {
}
