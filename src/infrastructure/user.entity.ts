import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { Match } from './match.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
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

  //Match History
  @OneToMany(() => Match, (match: Match) => match.winner)
  public matches: Match[];
}
