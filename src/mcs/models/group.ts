import {GroupSettings} from './group-settings.entity';
import {ChannelState} from './channel.state';
import {CategoryChannel, Guild} from 'discord.js';
import {NamingContract} from './naming/concerns/naming.contract';

export class Group {
    readonly channels = new Set<ChannelState>();

    constructor(
        public readonly settings: GroupSettings,
        public readonly guild: Guild,
        public readonly naming: NamingContract,
        public readonly parent?: CategoryChannel,
    ) {
    }

    get id(): number {
        return this.settings.id;
    }

    get allChannels(): number {
        return this.channels.size;
    }

    get emptyChannels(): number {
        return Array.from(this.channels)
            .filter(({channel}) => channel.members.size === 0)
            .length;
    }

    firstChannel(exclude?: ChannelState): ChannelState | null {
        return this.channels.size > 0
            ? Array.from(this.channels)
                .filter((state) => state != exclude)
                .reduce(
                    (a, b) =>
                        (
                            a.channel.rawPosition == b.channel.rawPosition
                                ? a.channel.position < b.channel.position
                                : a.channel.rawPosition < b.channel.rawPosition
                        )
                            ? a
                            : b,
                )
            : null;
    }

    lastChannel(exclude?: ChannelState): ChannelState | null {
        return this.channels.size > 0
            ? Array.from(this.channels)
                .filter((state) => state != exclude)
                .reduce(
                    (a, b) =>
                        (
                            a.channel.rawPosition == b.channel.rawPosition
                                ? a.channel.position > b.channel.position
                                : a.channel.rawPosition > b.channel.rawPosition
                        )
                            ? a
                            : b,
                )
            : null;
    }
}
