import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('commands_channel')
export class WhitelistedChannel {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    @Index()
    guildId: string;

    @Column({unique: true})
    channelId: string;
}
