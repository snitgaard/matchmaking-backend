import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Match } from './match.entity';

@Entity()
export class MatchResult {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: false })
  public result: boolean;

  @ManyToOne(() => Match, (match: Match) => match.matchResults)
  public match: Match;

  @ManyToOne(() => User, (user: User) => user.matchResults)
  public user: User;
}
