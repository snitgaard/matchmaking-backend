import { User } from '../../infrastructure/user.entity';

export interface Match {
  id: string;
  winner: User;
  loser: User;
  score: string;
}
