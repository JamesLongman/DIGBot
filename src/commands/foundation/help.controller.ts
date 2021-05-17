import {Controller} from '@nestjs/common';
import {Command} from './decorators/command.decorator';
import {CommandContainer} from './command.container';
import {MessageEmbed} from 'discord.js';

@Controller()
export class HelpController {
    constructor(
        private readonly repository: CommandContainer,
    ) {
    }

    @Command({
        command: '!help',
        description: 'Show information about the controllers',
    })
    async help() {
        return new MessageEmbed({
            fields: this.repository.all()
                .filter(({command, adminOnly}) => !command.startsWith('!help') && !adminOnly)
                .map(({command, description}) => ({
                    name: command,
                    value: description,
                })),
        });
    }
}
