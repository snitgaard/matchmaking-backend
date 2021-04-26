import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryColumn({ unique: false })
  public message: string;

  @ManyToOne(() => User, (user: User) => user.messages)
  public user: User;

  @Column({ unique: false, type: 'bigint' })
  public date: number;
}
