import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {Messenger} from './concerns/messenger';

@Entity('messenger_join')
@Unique(['guildId', 'channelId'])
export class JoinMessenger implements Messenger {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    @Index()
    guildId: string;

    @Column({nullable: true})
    channelId?: string;

    @Column({type: 'text'})
    message: string;
}