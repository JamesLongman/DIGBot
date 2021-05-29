import {Injectable} from '@nestjs/common';
import {McsService} from '../mcs.service';
import {Group} from '../models/group';
import {ChannelState} from '../models/channel.state';
import {McsEvents} from '../mcs.constants';
import {NamingOnJoinContract} from '../models/naming/concerns/naming-on-join.contract';
import {VoiceChannel} from 'discord.js';
import Timeout = NodeJS.Timeout;

@Injectable()
export class NamingService {
    private static readonly RENAME_DEFAULT_DELAY = 10 * 1000;
    private static readonly RENAME_JOIN_DELAY = 2 * 1000;

    private readonly queued = new Map<ChannelState, Timeout>();

    constructor(
        private readonly mcsService: McsService,
    ) {
        this.prepareListeners();
    }

    private prepareListeners(): void {
        this.mcsService.on(McsEvents.GROUP_ADDED, this.onGroupAdd.bind(this));
        this.mcsService.on(McsEvents.GROUP_REMOVED, this.onGroupRemove.bind(this));
        this.mcsService.on(McsEvents.GROUP_OCCUPATION_CHANGE, this.onGroupOccupationChange.bind(this));

        this.mcsService.on(McsEvents.CHANNEL_ADDED, this.onChannelAdded.bind(this));
        this.mcsService.on(McsEvents.CHANNEL_REMOVED, this.onChannelRemoved.bind(this));
        this.mcsService.on(McsEvents.CHANNEL_UPDATE, this.onChannelUpdate.bind(this));
    }

    planRename(state: ChannelState): void {
        this.cancelRename(state);

        const name = state.group.naming.forChannel(state);

        if (state.channel.name == name) return;

        this.queued.set(
            state,
            setTimeout(() => {
                state.hasCustomName = false;
                void state.channel.setName(name, 'Modular Channel System: reset name');
            }, NamingService.RENAME_DEFAULT_DELAY)
                .unref(),
        );
    }

    planRenameJoin(state: ChannelState): void {
        if ('forChannelOnJoin' in state.group.naming) {
            this.cancelRename(state);

            const name = (state.group.naming as NamingOnJoinContract).forChannelOnJoin(state);

            if (!name || state.channel.name == name) return;

            this.queued.set(
                state,
                setTimeout(() => {
                    state.hasCustomName = true;
                    void state.channel.setName(name, 'Modular Channel System: reset name');
                }, NamingService.RENAME_JOIN_DELAY)
                    .unref(),
            );
        }
    }

    cancelRename(state: ChannelState): void {
        const job = this.queued.get(state);
        if (!job) return;

        clearTimeout(job);
        this.queued.delete(state);
    }

    private reevaluate(state: ChannelState): void {
        if (state.isEmpty) {
            state.canBeRenamed = true;
            state.owner = null;

            this.planRename(state);
        } else if (state.canBeRenamed) {
            state.canBeRenamed = false;
            state.owner = state.channel.members.first();

            this.planRenameJoin(state);
        }
    }

    onGroupAdd(group: Group): void {
        for (const state of group.channels) {
            state.hasCustomName = state.isEmpty ? false : group.naming.hasCustomName(state);
            state.canBeRenamed = state.isEmpty;
            state.owner = state.channel.members.first();

            if (state.isEmpty)
                this.planRename(state);
        }
    }

    onGroupRemove(group: Group): void {
        for (const state of group.channels)
            this.cancelRename(state);
    }

    onGroupOccupationChange(group: Group, channels: ChannelState[]): void {
        for (const state of channels)
            this.reevaluate(state);
    }

    onChannelAdded(state: ChannelState): void {
        state.hasCustomName = state.isEmpty ? false : state.group.naming.hasCustomName(state);
        state.canBeRenamed = state.isEmpty;
        state.owner = state.channel.members.first();

        this.reevaluate(state);
    }

    onChannelRemoved(state: ChannelState): void {
        this.cancelRename(state);
    }

    onChannelUpdate(state: ChannelState, prev: VoiceChannel): void {
        if (prev.rawPosition != state.channel.rawPosition && (state.isEmpty || !state.hasCustomName)) {
            this.planRename(state);
        } else if (prev.name != state.channel.name) {
            if (state.isEmpty)
                this.planRename(state);
            else
                state.hasCustomName = true;
        }
    }
}
