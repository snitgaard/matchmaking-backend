import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Chat {
  @PrimaryColumn({ unique: false })
  public message: string;

  @ManyToOne(() => User, (user: User) => user.chat)
  public user: User;

  @Column({ unique: false, type: 'bigint' })
  public date: number;
}
