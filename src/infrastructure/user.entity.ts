import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {Message} from './message.entity';

@Entity()
export class User {
    @PrimaryColumn({ unique: true })
    public id: string;

    @Column({ unique: true })
    public username: string;

    @Column({ unique: false })
    public password: string;

    @Column({ unique: false })
    public rating: number;

    @Column({ unique: false })
    public inGame: boolean;

    @Column({ unique: false })
    public inQueue: boolean;

    @OneToMany(() => Message, (message: Message) => message.user)
    public messages: Message[];
}
