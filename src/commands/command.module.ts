import {Module} from '@nestjs/common';
import {TheCatApiModule} from '../apis/thecatapi/thecatapi.module';
import {CatsController} from './cats.controller';
import {DragonsController} from './dragons.controller';
import {CommandCoreModule} from './foundation/command-core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Dragons} from './dragons/dragons.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Dragons,
        ]),
        CommandCoreModule,
        TheCatApiModule,
    ],
    controllers: [
        CatsController,
        DragonsController,
    ],
})
export class CommandModule {
}
