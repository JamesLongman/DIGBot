import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {GroupSettings} from '../models/group-settings.entity';
import {Repository} from 'typeorm';
import {AllocatedChannel} from '../models/allocated-channel.entity';
import {ChannelManager, VoiceChannel} from 'discord.js';
import {GroupFactory} from '../factories/group.factory';
import {ChannelState} from '../models/channel.state';
import {McsService} from '../mcs.service';
import {McsEvents} from '../mcs.constants';
import {Group} from '../models/group';

@Injectable()
export class SyncService {
    private static readonly logger = new Logger('McsSyncService');

    constructor(
        private readonly mcsService: McsService,
        @InjectRepository(GroupSettings)
        private readonly settingsRepository: Repository<GroupSettings>,
        @InjectRepository(AllocatedChannel)
        private readonly channelRepository: Repository<AllocatedChannel>,
        private readonly groupFactory: GroupFactory,
        private readonly channelManager: ChannelManager,
    ) {
        this.prepareListeners();
    }

    private prepareListeners(): void {
        this.mcsService.on(McsEvents.GROUP_REMOVED, this.onGroupRemove.bind(this));

        this.mcsService.on(McsEvents.CHANNEL_ADDED, this.onChannelAdd.bind(this));
        this.mcsService.on(McsEvents.CHANNEL_REMOVED, this.onChannelRemove.bind(this));
    }

    async init(): Promise<void> {
        const groups = await this.settingsRepository.find();

        for (const settings of groups)
            this.initGroup(settings);
    }

    private async initGroup(settings: GroupSettings): Promise<void> {
        const channels = await this.channelRepository.find({group: settings});

        try {
            const group = await this.groupFactory.create(settings);

            await Promise.all(
                channels.map(async (channel) => {
                    try {
                        const vc = await this.channelManager.fetch(channel.channelId) as VoiceChannel;

                        if (vc.parent !== group.parent) {
                            void this.channelRepository.remove(channel);

                            return;
                        }

                        group.channels.add(
                            new ChannelState(
                                group,
                                vc,
                            ));
                    } catch (err) {
                        if (err.httpStatus === 404)
                            void this.channelRepository.remove(channel);
                        else
                            SyncService.logger.warn(`Error occurred when initializing channel "${channel.channelId}" for group "${settings.id}": ${err}`);
                    }
                }));

            this.mcsService.addGroup(group);
        } catch (err) {
            SyncService.logger.warn(`Failed to initialize group "${settings.id}": ${err}`);
        }
    }

    onGroupRemove(group: Group): void {
        void this.settingsRepository.remove(group.settings);
    }

    onChannelAdd(channel: ChannelState): void {
        this.channelRepository.save(
            this.channelRepository.create({
                channelId: channel.channelId,
                group: channel.group.settings,
            }),
        );
    }

    onChannelRemove(channel: ChannelState): void {
        this.channelRepository.delete({
            channelId: channel.channelId,
            group: channel.group.settings,
        });
    }
}
