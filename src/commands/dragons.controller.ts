import {Controller} from '@nestjs/common';
import {Command} from './foundation/decorators/command.decorator';
import {InjectRepository} from '@nestjs/typeorm';
import {Dragons} from './dragons/dragons.entity';
import {Repository} from 'typeorm';
import {CommandRequest} from './foundation/command.request';

@Controller()
export class DragonsController {
    constructor(
        @InjectRepository(Dragons)
        private readonly dragonsRepository: Repository<Dragons>,
    ) {
    }

    @Command({
        command: '!dragons',
        description: 'Get access to the lawless nsfw channels',
    })
    async dragon({member, message, guild}: CommandRequest) {
        const settings = await this.dragonsRepository.findOne({guildId: guild.id});
        if (!settings) return;

        if (member.roles.cache.has(settings.roleId)) {
            await member.roles.add(settings.roleId);
            await message.react('🐉');
        } else {
            await member.roles.remove(settings.roleId);
            return `${member}, you already had the herebedragons role. I've removed it. Type !dragons again to resubscribe.`;
        }
    }
}
