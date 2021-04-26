import { User } from '../../infrastructure/user.entity';

export interface MatchGames {
  id: string;
  winner: User;
  loser: User;
  score: string;
}
