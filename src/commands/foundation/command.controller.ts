import {Controller, Logger} from '@nestjs/common';
import {GuildMember, Message, MessageEmbed, Permissions, TextChannel} from 'discord.js';
import {On} from '../../discord/decorators/on.decorator';
import {CommandContainer} from './command.container';
import {ArgumentLexer} from './helpers/argument.lexer';
import {GuildSettingsService} from './services/guild-settings.service';
import {CommandRequest} from './command.request';
import {CommandException} from './exceptions/command.exception';

@Controller()
export class CommandController {
    private static readonly logger = new Logger('CommandController');

    private readonly devIds: string[] = process.env.DISCORD_DEV_IDS?.split(',') ?? [];

    constructor(
        private readonly repository: CommandContainer,
        private readonly settingsService: GuildSettingsService,
    ) {
    }

    @On('message')
    async message(message: Message) {
        if (message.author.bot || message.channel.type !== 'text') return;

        const lexer = new ArgumentLexer(message.cleanContent);
        const commandName = lexer.next();
        const command = this.repository.get(commandName);

        if (command) {
            const isAdmin = await this.hasAdminPermissions(message.member);

            if (command.adminOnly && !isAdmin) return; // Check permissions
            if (!isAdmin && !await this.isCommandChannel(message.channel)) return; // Check channel

            const request = new CommandRequest(message, lexer.all());

            try {
                const response = await command.handler(request);

                if (typeof response == 'string' || response instanceof MessageEmbed)
                    await message.channel.send(response);
                else if (response)
                    CommandController.logger.warn(`Command "${command.command}" returned unexpected object of type "${typeof response}"`);
            } catch (err) {
                await message.channel.send(
                    err instanceof CommandException
                        ? err.response
                        : new MessageEmbed().setColor('RED').setDescription('Unexpected failure'),
                );

                if (!(err instanceof CommandException))
                    CommandController.logger.warn(`Command "${command.command}" failed unexpectedly: ${err}`);
            }
        }
    }

    private async hasAdminPermissions(member: GuildMember): Promise<boolean> {
        if (this.devIds.includes(member.id))
            return true;

        if (member.hasPermission(Permissions.FLAGS.ADMINISTRATOR))
            return true;

        return this.settingsService.hasAdminRole(member);
    }

    private async isCommandChannel(channel: TextChannel): Promise<boolean> {
        return this.settingsService.isWhitelisted(channel);
    }
}
