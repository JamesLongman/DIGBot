import {Controller, Logger} from '@nestjs/common';
import {On} from '../discord/decorators/on.decorator';
import {ChannelManager, GuildMember, MessageEmbed, Role, TextChannel} from 'discord.js';
import {Repository} from 'typeorm';
import {RoleMessenger} from './models/role-messenger.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {JoinMessenger} from './models/join-messenger.entity';
import {Messenger} from './models/concerns/messenger';

@Controller()
export class MessengerController {
    private static readonly logger = new Logger('MessengerController');

    constructor(
        @InjectRepository(RoleMessenger)
        private readonly roleRepository: Repository<RoleMessenger>,
        @InjectRepository(JoinMessenger)
        private readonly joinRepository: Repository<JoinMessenger>,
        private readonly channelManager: ChannelManager,
    ) {
    }

    @On('guildMemberUpdate')
    async role(old: GuildMember, member: GuildMember) {
        if (member.user.bot) return;

        member.roles.cache.filter((role) => !old.roles.cache.has(role.id))
            .forEach((role) => this.roleAssigned(member, role));
    }

    private async roleAssigned(member: GuildMember, role: Role): Promise<void> {
        const actions = await this.roleRepository.find({roleId: role.id});

        this.message(actions, member);
    }

    @On('guildMemberAdd')
    async join(member: GuildMember) {
        if (member.user.bot) return;

        const actions = await this.joinRepository.find({guildId: member.guild.id});

        await this.message(actions, member);
    }

    private async message(actions: Messenger[], member: GuildMember): Promise<void> {
        await Promise.all(actions.map(async (action) => {
            try {
                if (action.channelId) {
                    const channel = await this.channelManager.fetch(action.channelId) as TextChannel;

                    channel.send(this.formatMessage(action.message, member));
                } else {
                    await member.send(
                        new MessageEmbed()
                            .setTitle(`Message from ${member.guild.name}`)
                            .setDescription(this.formatMessage(action.message, member)),
                    );
                }
            } catch (err) {
                MessengerController.logger.warn(`Unable to perform action "${action.id}" for member "${member.id}": ${err}`);
            }
        }));
    }

    private formatMessage(message: string, member: GuildMember): string {
        return message
            .replace(/(?<!\\)\$member/, member.toString())
            .replace(/(?<!\\)\$name/, member.displayName);
    }
}
