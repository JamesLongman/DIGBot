import {NamingContract} from './concerns/naming.contract';
import {ChannelState} from '../channel.state';
import {Group} from '../group';
import {Injectable} from '@nestjs/common';

@Injectable()
export class NumberedNaming implements NamingContract {
    forChannel(state: ChannelState): string {
        const first = state.group.firstChannel();

        return this.makeName(
            state.group,
            first ? (state.channel.position - first.channel.position + 1) : 1,
        );
    }

    forNewChannel(group: Group): string {
        return this.makeName(
            group,
            group.allChannels + 1,
        );
    }

    hasCustomName(state: ChannelState): boolean {
        return !state.channel.name.startsWith(state.group.settings.name);
    }

    private makeName(group: Group, no: number): string {
        return `${group.settings.name}${no}`;
    }
}
