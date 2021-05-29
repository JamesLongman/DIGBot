import {Injectable} from '@nestjs/common';
import {Group} from '../models/group';
import {GroupSettings, NamingPolicy} from '../models/group-settings.entity';
import {CategoryChannel, ChannelManager, GuildManager} from 'discord.js';
import {NumberedNaming} from '../models/naming/numbered.naming';
import {NamingContract} from '../models/naming/concerns/naming.contract';
import {PresenceNaming} from '../models/naming/presence.naming';

@Injectable()
export class GroupFactory {
    constructor(
        private readonly guildManager: GuildManager,
        private readonly channelManager: ChannelManager,
        private readonly numberedNaming: NumberedNaming,
        private readonly presenceNaming: PresenceNaming,
    ) {
    }

    async create(settings: GroupSettings): Promise<Group> {
        const {guildId, parentId, namingPolicy} = settings;

        return new Group(
            settings,
            await this.guildManager.fetch(guildId),
            this.getNaming(namingPolicy),
            parentId ? await this.channelManager.fetch(parentId) as CategoryChannel : undefined,
        );
    }

    private getNaming(policy: NamingPolicy): NamingContract {
        switch (policy) {
            case NamingPolicy.PRESENCE:
                return this.presenceNaming;
            default:
                return this.numberedNaming;
        }
    }
}
