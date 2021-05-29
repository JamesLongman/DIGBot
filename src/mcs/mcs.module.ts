import {Logger, Module, OnApplicationBootstrap} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GroupSettings} from './models/group-settings.entity';
import {AllocatedChannel} from './models/allocated-channel.entity';
import {SyncService} from './services/sync.service';
import {McsService} from './mcs.service';
import {McsContainer} from './mcs.container';
import {ChannelFactory} from './factories/channel.factory';
import {GroupFactory} from './factories/group.factory';
import {AllocationService} from './services/allocation.service';
import {DiscordModule} from '../discord/discord.module';
import {NumberedNaming} from './models/naming/numbered.naming';
import {PresenceNaming} from './models/naming/presence.naming';
import {NamingService} from './services/naming.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GroupSettings,
            AllocatedChannel,
        ]),
        DiscordModule,
    ],
    providers: [
        McsService,
        McsContainer,
        ChannelFactory,
        GroupFactory,
        AllocationService,
        NamingService,
        SyncService,
        NumberedNaming,
        PresenceNaming,
    ],
})
export class McsModule implements OnApplicationBootstrap {
    private static readonly logger = new Logger('McsModule');

    constructor(
        private readonly syncService: SyncService,
    ) {
    }

    onApplicationBootstrap(): void {
        McsModule.logger.log('Initializing');

        void this.syncService.init();
    }
}