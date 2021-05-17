import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('commands_admin_roles')
export class AdminRole {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    @Index()
    guildId: string;

    @Column({unique: true})
    roleId: string;
}
