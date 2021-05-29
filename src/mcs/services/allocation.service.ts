import {Injectable} from '@nestjs/common';
import {McsService} from '../mcs.service';
import {McsEvents} from '../mcs.constants';
import {Group} from '../models/group';
import {ChannelState} from '../models/channel.state';
import {ChannelFactory} from '../factories/channel.factory';
import Timeout = NodeJS.Timeout;

enum JobType {
    CREATE,
    DELETE
}

@Injectable()
export class AllocationService {
    private readonly queue = new Map<Group, [JobType, Timeout]>();

    private static readonly CHANNEL_CREATE_DELAY = 40 * 1000;
    private static readonly CHANNEL_DELETE_DELAY = 3 * 60 * 1000;

    constructor(
        private readonly mcsService: McsService,
        private readonly channelFactory: ChannelFactory,
    ) {
        this.prepareListeners();
    }

    private prepareListeners(): void {
        this.mcsService.on(McsEvents.GROUP_ADDED, this.onGroupAdd.bind(this));
        this.mcsService.on(McsEvents.GROUP_REMOVED, this.onGroupRemove.bind(this));
        this.mcsService.on(McsEvents.GROUP_OCCUPATION_CHANGE, this.onGroupOccupationChange.bind(this));

        this.mcsService.on(McsEvents.CHANNEL_ADDED, this.onChannelAdded.bind(this));
        this.mcsService.on(McsEvents.CHANNEL_REMOVED, this.onChannelRemoved.bind(this));
    }

    reevaluate(group: Group): void {
        const tare = this.evaluateTare(group);

        if (tare > 0)
            this.planDeleteChannel(group);
        else if (tare < 0)
            this.planCreateChannel(group);
        else
            this.cancelAllocation(group);
    }


    evaluateTare(group: Group): number {
        return Math.max(
            group.allChannels - group.settings.maxChannels,
            group.emptyChannels - group.settings.minFreeChannels,
        );
    }

    private planDeleteChannel(group: Group): void {
        const [type, timeout] = this.queue.get(group) ?? [];

        if (type === JobType.DELETE)
            return;

        if (timeout)
            clearTimeout(timeout);

        this.queue.set(group, [
            JobType.DELETE,
            setTimeout(() => {
                this.queue.delete(group);

                this.nominateChannel(group).channel.delete('Modular channel system');
            }, AllocationService.CHANNEL_DELETE_DELAY).unref(),
        ]);
    }

    private nominateChannel(group: Group): ChannelState {
        return Array.from(group.channels)
            .filter((channel) => channel.isEmpty)
            .reduce((a, b) => a.channel.rawPosition > b.channel.rawPosition ? a : b);
    }

    private planCreateChannel(group: Group): void {
        const [type, timeout] = this.queue.get(group) ?? [];

        if (type === JobType.CREATE)
            return;

        if (timeout)
            clearTimeout(timeout);

        this.queue.set(group, [
            JobType.CREATE,
            setTimeout(async () => {
                this.queue.delete(group);

                this.mcsService.addChannel(group, await this.channelFactory.create(group, 'Modular channel system'));
            }, AllocationService.CHANNEL_CREATE_DELAY).unref(),
        ]);
    }

    private cancelAllocation(group: Group): void {
        const [, timeout] = this.queue.get(group) ?? [];

        if (timeout)
            clearTimeout(timeout);

        this.queue.delete(group);
    }

    onGroupAdd(group: Group): void {
        this.reevaluate(group);
    }

    onGroupRemove(group: Group): void {
        this.cancelAllocation(group);
    }

    onGroupOccupationChange(group: Group): void {
        this.reevaluate(group);
    }

    onChannelAdded({group}: ChannelState): void {
        this.reevaluate(group);
    }

    onChannelRemoved({group}: ChannelState): void {
        this.reevaluate(group);
    }
}
