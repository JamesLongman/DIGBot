import {ChannelState} from '../../channel.state';

export interface NamingOnJoinContract {
    forChannelOnJoin(state: ChannelState): string;
}