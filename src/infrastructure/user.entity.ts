import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { Match } from './match.entity';
import { MatchResult } from './match-result.entity';

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

  @Column({ unique: false })
  public isActive: boolean;

  @Column({ unique: false })
  public lobbyLeader: boolean;

  @OneToMany(() => Chat, (chat: Chat) => chat.user)
  public chat: Chat[];

  //Match History
  @OneToMany(() => MatchResult, (matchResults: MatchResult) => matchResults.user)
  public matchResults: MatchResult[];
}
