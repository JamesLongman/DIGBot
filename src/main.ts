import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: process.env.NODE_ENV === 'production'
            ? ['error', 'warn', 'log']
            : ['error', 'warn', 'log', 'debug'],
    });

    const logger = new Logger('App');

    app.enableShutdownHooks();

    process
        .on('uncaughtException', (err) => {
            logger.error(err.message, err.stack);

            process.exit(1);
        })
        .on('unhandledRejection', (err: any) => {
            logger.error(err, err.stack);

            process.exit(1);
        });

    await app.listen(3000);
}

void bootstrap();
