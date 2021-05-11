import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user: User) => user.matches)
  public winner: User;

  @ManyToOne(() => User, (user: User) => user.matches)
  public loser: User;

  @Column({ unique: false })
  public score: string;
}
