import {Injectable} from '@nestjs/common';
import {Group} from './models/group';
import {ChannelState} from './models/channel.state';
import {CategoryChannel, Guild, VoiceChannel} from 'discord.js';

@Injectable()
export class McsContainer {
    private readonly groups = new Map<number, Group>();
    private readonly channels = new Map<string, ChannelState>();

    private readonly groupsInRoot = new Map<string, Set<Group>>();
    private readonly groupsInParent = new Map<string, Set<Group>>();

    getGroupsInRoot(root: string): Group[];
    getGroupsInRoot(root: Guild): Group[];
    getGroupsInRoot(root: string | Guild): Group[] {
        if (root instanceof Guild)
            root = root.id;

        return Array.from(this.groupsInRoot.get(root) ?? []);
    }

    getGroupsInParent(parent: string): Group[];
    getGroupsInParent(parent: CategoryChannel): Group[];
    getGroupsInParent(parent: string | CategoryChannel): Group[] {
        if (parent instanceof CategoryChannel)
            parent = parent.id;

        return Array.from(this.groupsInParent.get(parent) ?? []);
    }

    getChannel(channel: string): ChannelState | null;
    getChannel(channel: VoiceChannel): ChannelState | null;
    getChannel(channel: string | VoiceChannel): ChannelState | null {
        if (channel instanceof VoiceChannel)
            channel = channel.id;

        return this.channels.get(channel) ?? null;
    }

    addGroup(group: Group): boolean {
        if (this.groups.has(group.id)) return false;

        this.groups.set(group.id, group);

        if (group.parent)
            this.setMapSet(this.groupsInParent, group.parent.id, group);
        else
            this.setMapSet(this.groupsInRoot, group.guild.id, group);

        for (const channel of group.channels)
            this.channels.set(channel.channelId, channel);

        return true;
    }

    removeGroup(group: Group): void {
        this.groups.delete(group.id);

        if (group.parent)
            this.removeMapSet(this.groupsInParent, group.parent.id, group);
        else
            this.removeMapSet(this.groupsInRoot, group.guild.id, group);

        for (const channelState of group.channels)
            this.channels.delete(channelState.channelId);
    }

    addChannel(channel: ChannelState): void {
        channel.group.channels.add(channel);

        this.channels.set(channel.channelId, channel);
    }

    removeChannel(channel: ChannelState): void {
        channel.group.channels.delete(channel);

        this.channels.delete(channel.channelId);
    }

    private setMapSet(map: Map<string, Set<Group>>, key: string, value: Group): void {
        let col = map.get(key);

        if (!col) {
            col = new Set<Group>();
            map.set(key, col);
        }

        col.add(value);
    }

    private removeMapSet(map: Map<string, Set<Group>>, key: string, value: Group): boolean {
        return map.get(key)?.delete(value) ?? false;
    }
}