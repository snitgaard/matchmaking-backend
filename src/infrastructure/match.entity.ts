import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MatchResult } from './match-result.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToMany(
    () => MatchResult,
    (matchResult: MatchResult) => matchResult.match,
    {
      cascade: true,
    },
  )
  public matchResults: MatchResult[];

  @Column({ unique: false })
  public score: string;

  @Column({ unique: false })
  public hasEnded: boolean;
}
