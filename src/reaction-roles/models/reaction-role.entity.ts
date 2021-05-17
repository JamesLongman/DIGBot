import {Column, Entity, Index, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity('rr_role')
@Unique(['messageId', 'emoji'])
export class ReactionRole {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    @Index()
    guildId: string;

    @Column()
    channelId: string;

    @Column()
    @Index()
    messageId: string;

    @Column()
    emoji: string;

    @Column()
    @Index()
    roleId: string;
}
