import {Client} from 'discord.js';
import {Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';
import {DiscordModuleOptions} from './interfaces/discordmodule.options';

@Injectable()
export class DiscordClient extends Client implements OnApplicationBootstrap, OnApplicationShutdown {
    private static readonly logger = new Logger('DiscordClient');

    constructor(options: DiscordModuleOptions) {
        super(options);

        this.token = options.token;

        this.prepareListeners();
    }

    async onApplicationBootstrap(): Promise<void> {
        DiscordClient.logger.log('Connecting client');

        await this.login();
    }

    onApplicationShutdown(): void {
        this.destroy();

        DiscordClient.logger.log('Client destroyed');
    }

    private prepareListeners(): void {
        this.on('error', (error) => {
            DiscordClient.logger.error(error.message, error.stack);

            process.exit(1);
        });

        this.on('shardError', (error, shard) => DiscordClient.logger.error(error.message, error.stack, `DiscordShard${shard}`));


        this.on('debug', (info) => DiscordClient.logger.verbose(info));
        this.on('guildUnavailable', ({
                                         name,
                                         id,
                                     }) => DiscordClient.logger.log(`Guild became unavailable: ${name}(${id})`));
        this.on('rateLimit', (info) => DiscordClient.logger.debug(`Rate limited: ${JSON.stringify(info)}`));
        this.on('ready', () => DiscordClient.logger.log('Client ready'));
        this.on('warn', (warning) => DiscordClient.logger.warn(warning));
        this.on('shardDisconnect', ({
                                        reason = 'No reason given',
                                        code = NaN,
                                    }, shard) => DiscordClient.logger.verbose(`Shard disconnected: ${reason}(${code})`, `DiscordShard${shard}`));
        this.on('shardReady', (shard) => DiscordClient.logger.verbose('Shard ready', `DiscordShard${shard}`));
        this.on('shardReconnecting', (shard) => DiscordClient.logger.verbose('Shard reconnecting', `DiscordShard${shard}`));
        this.on('shardResume', (replayed, shard) => DiscordClient.logger.verbose(`Shard resumed: ${replayed}`, `DiscordShard${shard}`));
    }
}
