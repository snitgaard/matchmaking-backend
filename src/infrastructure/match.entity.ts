import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @OneToMany(() => User, (user: User) => user.matches)
  public winner: User;

  @OneToMany(() => User, (user: User) => user.matches)
  public loser: User;

  @Column({ unique: false })
  public score: string;
}
