import {EventEmitter} from 'events';
import {Injectable} from '@nestjs/common';
import {On} from '../discord/decorators/on.decorator';
import {Channel, VoiceChannel} from 'discord.js';
import {McsContainer} from './mcs.container';
import {ChannelState} from './models/channel.state';
import {McsEvents} from './mcs.constants';
import {Group} from './models/group';

@Injectable()
export class McsService extends EventEmitter {
    constructor(
        private readonly container: McsContainer,
    ) {
        super();
    }

    @On('voiceStateUpdate')
    onVoiceStateUpdate({channel: prev}: ChannelState, {channel: cur}: ChannelState): void {
        const prevChannel = prev ? this.container.getChannel(prev) : null;
        const curChannel = cur ? this.container.getChannel(cur) : null;

        if (prevChannel && curChannel && prevChannel.group == curChannel.group) {
            setImmediate(() =>
                this.emit(McsEvents.GROUP_OCCUPATION_CHANGE, curChannel.group, [prevChannel, curChannel]));
        } else {
            if (prevChannel)
                setImmediate(() =>
                    this.emit(McsEvents.GROUP_OCCUPATION_CHANGE, prevChannel.group, [prevChannel]));

            if (curChannel)
                setImmediate(() =>
                    this.emit(McsEvents.GROUP_OCCUPATION_CHANGE, curChannel.group, [curChannel]));
        }
    }

    @On('channelUpdate')
    onChannelUpdate(prev: VoiceChannel, channel: VoiceChannel): void {
        if (channel instanceof VoiceChannel) {
            const state = this.container.getChannel(channel);
            if (!state) return;

            if (channel.parent !== state.group.parent)
                this.removeChannel(state);
            else
                this.emit(McsEvents.CHANNEL_UPDATE, state, prev);
        }
    }

    @On('channelDelete')
    onChannelDelete(channel: Channel): void {
        if (channel instanceof VoiceChannel) {
            const state = this.container.getChannel(channel);
            if (!state) return;

            this.container.removeChannel(state);

            setImmediate(() =>
                this.emit(McsEvents.CHANNEL_REMOVED, state));
        }
    }

    addGroup(group: Group): void {
        if (this.container.addGroup(group))
            setImmediate(() =>
                this.emit(McsEvents.GROUP_ADDED, group));
    }

    removeGroup(group: Group): void {
        this.container.removeGroup(group);

        setImmediate(() =>
            this.emit(McsEvents.GROUP_REMOVED, group));
    }

    addChannel(group: Group, channel: VoiceChannel): void {
        const state = new ChannelState(group, channel);

        this.container.addChannel(state);

        setImmediate(() =>
            this.emit(McsEvents.CHANNEL_ADDED, state));
    }

    removeChannel(channel: ChannelState): void {
        this.container.removeChannel(channel);

        setImmediate(() =>
            this.emit(McsEvents.CHANNEL_REMOVED, channel));
    }
}