import {NumberedNaming} from './numbered.naming';
import {NamingContract} from './concerns/naming.contract';
import {ChannelState} from '../channel.state';
import {Injectable} from '@nestjs/common';

@Injectable()
export class PresenceNaming extends NumberedNaming implements NamingContract {
    getChannelNameOnJoin(state: ChannelState): string {
        return this.getPresenceName(state) ?? super.forChannel(state);
    }

    private getPresenceName(state: ChannelState): string | null {
        // TODO: Normalize?
        return state.owner.presence.activities[0]?.name;
    }
}