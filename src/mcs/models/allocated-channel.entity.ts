import {GroupSettings} from './group-settings.entity';
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity('mcs_allocated_channel')
export class AllocatedChannel {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({unique: true})
    channelId: string;

    @ManyToOne(() => GroupSettings, {
        onDelete: 'CASCADE',
    })
    group: GroupSettings;
}
