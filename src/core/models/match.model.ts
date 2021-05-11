import { User } from '../../infrastructure/user.entity';

export interface MatchModel {
  id: string;
  winner?: User;
  loser?: User;
  score?: string;
}
