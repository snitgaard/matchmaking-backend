import { Column, Entity, PrimaryColumn } from 'typeorm';

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

}
