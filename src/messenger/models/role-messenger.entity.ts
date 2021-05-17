import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {Messenger} from './concerns/messenger';

@Entity('messenger_role')
@Unique(['roleId', 'channelId'])
export class RoleMessenger implements Messenger {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    @Index()
    guildId: string;

    @Column({unique: true})
    roleId: string;

    @Column({nullable: true})
    channelId?: string;

    @Column({type: 'text'})
    message: string;
}