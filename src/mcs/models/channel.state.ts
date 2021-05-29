import {GuildMember, VoiceChannel} from 'discord.js';
import {Group} from './group';

export class ChannelState {
    public hasCustomName = false;

    public canBeRenamed = true;

    public owner?: GuildMember = null;

    constructor(
        public readonly group: Group,
        public readonly channel: VoiceChannel,
    ) {
    }

    get channelId(): string {
        return this.channel.id;
    }

    get isEmpty(): boolean {
        return this.channel.members.size === 0;
    }
}
