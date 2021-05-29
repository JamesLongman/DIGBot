import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

export enum NamingPolicy {
    NUMBERED = 'numbered',
    PRESENCE = 'precence'
}

@Entity('mcs_group_settings')
export class GroupSettings {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    @Index()
    guildId: string;

    @Column({nullable: true})
    parentId?: string;

    @Column()
    initPosition: number;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: NamingPolicy,
        default: NamingPolicy.NUMBERED,
    })
    namingPolicy: NamingPolicy;

    @Column()
    minFreeChannels: number;

    @Column()
    maxChannels: number;
}
