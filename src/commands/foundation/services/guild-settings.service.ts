import {Injectable} from '@nestjs/common';
import {In, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {WhitelistedChannel} from '../models/whitelisted-channel.entity';
import {Guild, GuildMember, Role, TextChannel} from 'discord.js';
import {AdminRole} from '../models/admin-role.entity';

@Injectable()
export class GuildSettingsService {
    constructor(
        @InjectRepository(WhitelistedChannel)
        private readonly channelRepository: Repository<WhitelistedChannel>,
        @InjectRepository(AdminRole)
        private readonly roleRepository: Repository<AdminRole>,
    ) {
    }

    getAllWhitelistedChannels(guild: Guild): Promise<WhitelistedChannel[]> {
        return this.channelRepository.find({guildId: guild.id});
    }

    async removeAllWhitelistedChannels(guild: Guild): Promise<void> {
        await this.channelRepository.delete({guildId: guild.id});
    }

    async toggleWhitelistedChannel(channel: TextChannel): Promise<boolean> {
        const whitelisted = await this.channelRepository.findOne({channelId: channel.id});

        if (whitelisted) {
            await this.channelRepository.remove(whitelisted);

            return false;
        }

        await this.channelRepository.save(
            this.channelRepository.create({
                guildId: channel.guild.id,
                channelId: channel.id,
            }),
        );

        return true;
    }

    async isWhitelisted(channel: TextChannel): Promise<boolean> {
        return await this.channelRepository.count({channelId: channel.id}) > 0;
    }

    async toggleAdminRole(role: Role): Promise<boolean> {
        const adminRole = await this.roleRepository.find({roleId: role.id});

        if (adminRole) {
            this.roleRepository.remove(adminRole);

            return false;
        }

        this.roleRepository.save(
            this.roleRepository.create({
                guildId: role.guild.id,
                roleId: role.id,
            }),
        );

        return true;
    }

    async hasAdminRole(member: GuildMember): Promise<boolean> {
        return await this.roleRepository.count({
            where: {
                roleId: In(member.roles.cache.map(({id}) => id)),
            },
            take: 1,
        }) > 0;
    }
}
