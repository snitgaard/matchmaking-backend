import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
  @PrimaryColumn({ unique: true })
  public id: string;

  @OneToMany(() => User, (user: User) => user.matches)
  public winner: User;

  @Column({ unique: false })
  public loser: User;

  @Column({ unique: false })
  public score: string;
}
